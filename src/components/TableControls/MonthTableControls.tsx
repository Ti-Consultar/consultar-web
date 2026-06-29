import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  Divider,
  ListItemText,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import ArchiveRoundedIcon from "@mui/icons-material/ArchiveRounded";
import OpenInFullIcon from "@mui/icons-material/OpenInFull";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import ViewColumnIcon from "@mui/icons-material/ViewColumn";

export interface MonthFilterOption {
  key: string;
  label: string;
}

interface MonthTableControlsProps {
  monthOptions: MonthFilterOption[];
  hiddenMonthKeys: string[];
  onShowAllMonths: () => void;
  onHideAllMonths: () => void;
  onToggleMonth: (monthKey: string) => void;
  onExpand?: () => void;
  expandDisabled?: boolean;
  hideExpand?: boolean;
}

export const useMonthVisibility = (
  storageKey: string,
  monthOptions: MonthFilterOption[],
) => {
  const [hiddenMonthKeys, setHiddenMonthKeys] = useState<string[]>([]);
  const eventName = useMemo(
    () => `month-table-visibility-change:${storageKey}`,
    [storageKey],
  );

  useEffect(() => {
    const loadHiddenMonthKeys = () => {
      try {
        const raw = localStorage.getItem(storageKey);
        if (!raw) {
          setHiddenMonthKeys([]);
          return;
        }

        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          setHiddenMonthKeys(parsed.filter((key) => typeof key === "string"));
        }
      } catch {
        setHiddenMonthKeys([]);
      }
    };

    loadHiddenMonthKeys();

    window.addEventListener("storage", loadHiddenMonthKeys);
    window.addEventListener(eventName, loadHiddenMonthKeys);

    return () => {
      window.removeEventListener("storage", loadHiddenMonthKeys);
      window.removeEventListener(eventName, loadHiddenMonthKeys);
    };
  }, [eventName, storageKey]);

  const persistHiddenMonthKeys = useCallback(
    (keys: string[]) => {
      setHiddenMonthKeys(keys);
      localStorage.setItem(storageKey, JSON.stringify(keys));
      window.dispatchEvent(new Event(eventName));
    },
    [eventName, storageKey],
  );

  const toggleMonthVisibility = useCallback(
    (monthKey: string) => {
      const isHidden = hiddenMonthKeys.includes(monthKey);
      const nextHidden = isHidden
        ? hiddenMonthKeys.filter((key) => key !== monthKey)
        : [...hiddenMonthKeys, monthKey];

      persistHiddenMonthKeys(nextHidden);
    },
    [hiddenMonthKeys, persistHiddenMonthKeys],
  );

  const showAllMonths = useCallback(
    () => persistHiddenMonthKeys([]),
    [persistHiddenMonthKeys],
  );

  const hideAllMonths = useCallback(
    () => persistHiddenMonthKeys(monthOptions.map((month) => month.key)),
    [monthOptions, persistHiddenMonthKeys],
  );

  return {
    hiddenMonthKeys,
    showAllMonths,
    hideAllMonths,
    toggleMonthVisibility,
  };
};

export const MonthTableControls = ({
  monthOptions,
  hiddenMonthKeys,
  onShowAllMonths,
  onHideAllMonths,
  onToggleMonth,
  onExpand,
  expandDisabled = false,
  hideExpand = false,
}: MonthTableControlsProps) => {
  const [monthMenuAnchor, setMonthMenuAnchor] = useState<null | HTMLElement>(
    null,
  );

  return (
    <>
      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 1,
          mb: 1.5,
          flexWrap: "wrap",
        }}
      >
        <Button
          variant="outlined"
          size="small"
          startIcon={<ViewColumnIcon />}
          onClick={(event) => setMonthMenuAnchor(event.currentTarget)}
          disabled={!monthOptions.length}
          sx={{ textTransform: "none", borderRadius: 2 }}
        >
          Meses
        </Button>

        {!hideExpand && onExpand && (
          <Button
            variant="outlined"
            size="small"
            startIcon={<OpenInFullIcon />}
            onClick={onExpand}
            disabled={expandDisabled}
            sx={{ textTransform: "none", borderRadius: 2 }}
          >
            Expandir
          </Button>
        )}
      </Box>

      <Menu
        anchorEl={monthMenuAnchor}
        open={Boolean(monthMenuAnchor)}
        onClose={() => setMonthMenuAnchor(null)}
        PaperProps={{
          sx: {
            width: 260,
            maxHeight: 420,
            borderRadius: 2,
          },
        }}
      >
        <MenuItem onClick={onShowAllMonths} dense>
          <RestartAltIcon fontSize="small" sx={{ mr: 1.5 }} />
          <ListItemText primary="Mostrar todos os meses" />
        </MenuItem>
        <MenuItem onClick={onHideAllMonths} dense disabled={!monthOptions.length}>
          <ViewColumnIcon fontSize="small" sx={{ mr: 1.5 }} />
          <ListItemText primary="Desmarcar todos" />
        </MenuItem>
        <Divider />
        {monthOptions.map((month) => {
          const checked = !hiddenMonthKeys.includes(month.key);
          return (
            <MenuItem
              key={month.key}
              onClick={() => onToggleMonth(month.key)}
              dense
            >
              <Checkbox checked={checked} size="small" />
              <ListItemText primary={month.label} />
            </MenuItem>
          );
        })}
      </Menu>
    </>
  );
};

export const TableEmptyState = () => (
  <Box
    display="flex"
    flexDirection="column"
    justifyContent="center"
    alignItems="center"
    minHeight={360}
    px={3}
    textAlign="center"
    color="text.secondary"
  >
    <ArchiveRoundedIcon sx={{ fontSize: 56, color: "text.disabled", mb: 1.5 }} />
    <Typography variant="subtitle1" fontWeight={700} color="text.primary">
      Ainda não há nada para exibir
    </Typography>
    <Typography variant="body2" sx={{ mt: 0.5, maxWidth: 460 }}>
      À medida que os cadastros forem realizados, as informações serão exibidas
      aqui.
    </Typography>
  </Box>
);
