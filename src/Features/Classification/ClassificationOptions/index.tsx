import {
  Box,
  Tabs,
  Tab,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
  Paper,
  Stack,
  Divider,
} from "@mui/material";
import { useState, useEffect } from "react";
import { DivSkeleton } from "../../../styles/skeleton/skeleton";

type TabOption = "ATIVO" | "PASSIVO" | "DRE";

interface ClassificationItem {
  id: number;
  name: string;
  typeClassification: TabOption;
  typeOrder: number;
}

interface ClassificationPanelProps {
  data: ClassificationItem[];
  selectedId?: number;
  isLoading?: boolean;
  onTabChange: (tabId: number) => void;
  onSelect: (id: number) => void;
  readOnly?: boolean;
}

const TAB_MAP: Record<TabOption, number> = {
  ATIVO: 1,
  PASSIVO: 2,
  DRE: 3,
};

export const ClassificationPanel = ({
  data,
  selectedId,
  isLoading = false,
  onTabChange,
  onSelect,
  readOnly,
}: ClassificationPanelProps) => {
  const [tab, setTab] = useState<TabOption>("ATIVO");

  const handleTabChange = (_: React.SyntheticEvent, newValue: TabOption) => {
    setTab(newValue);
    onTabChange(TAB_MAP[newValue]);
  };

  useEffect(() => {
    onTabChange(TAB_MAP[tab]);
  }, []);

  return (
    <Paper elevation={0} sx={{ borderRadius: 2, p: 2, minWidth: "400px" }}>
      <Tabs
        value={tab}
        onChange={handleTabChange}
        variant="fullWidth"
        sx={{
          mb: 2,
          "& .MuiTabs-indicator": {
            backgroundColor: "#5C57F4",
          },
        }}
      >
        <Tab label="Ativos" value="ATIVO" sx={{ fontWeight: 600 }} />
        <Tab label="Passivos" value="PASSIVO" sx={{ fontWeight: 600 }} />
        <Tab label="DRE" value="DRE" sx={{ fontWeight: 600 }} />
      </Tabs>

      <Box sx={{ px: 1 }}>
        <Box
          sx={{
            maxHeight: { xs: "300px", md: "400px" }, // ajustável conforme layout
            overflowY: "auto",
            pr: 1, // padding para não cortar o radio no scroll
          }}
        >
          {isLoading ? (
            <Stack spacing={1}>
              {Array.from({ length: 6 }).map((_, index) => (
                <DivSkeleton key={index} height="24px" borderRadius="6px" />
              ))}
            </Stack>
          ) : readOnly ? (
            <Stack spacing={1}>
              {data.map((item) => (
                <Box
                  key={item.id}
                  sx={{
                    px: 1,
                    py: 0.5,
                    borderRadius: 1,
                    bgcolor: "action.hover",
                    fontSize: { xs: "0.875rem", md: "1rem" },
                  }}
                >
                  {item.name}
                </Box>
              ))}
            </Stack>
          ) : (
            <RadioGroup
              name="classification"
              value={selectedId ?? ""}
              onChange={(e) => onSelect?.(Number(e.target.value))}
            >
              <Stack spacing={1}>
                {data.map((item) => (
                  <FormControlLabel
                    key={item.id}
                    value={item.id}
                    control={<Radio color="primary" />}
                    label={item.name}
                    sx={{
                      borderRadius: 1,
                      px: 1,
                      py: 0.5,
                      "& .MuiTypography-root": {
                        fontSize: { xs: "0.875rem", md: "1rem" },
                      },
                      "&:hover": {
                        backgroundColor: "action.hover",
                      },
                    }}
                  />
                ))}
              </Stack>
            </RadioGroup>
          )}
        </Box>
      </Box>
    </Paper>
  );
};
