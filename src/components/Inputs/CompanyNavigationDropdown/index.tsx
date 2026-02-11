import React, { useMemo, useState } from "react";
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import {
  Button,
  Menu,
  MenuItem,
  ListSubheader,
  TextField,
  Box,
  Typography,
} from "@mui/material";

interface Permission {
  id: number;
  name: string;
}

interface SubCompany {
  id: number;
  name: string;
  accountPlanId: number;
  permission: Permission;
}

interface Filial {
  id: number;
  name: string;
  accountPlanId: number;
  permission: Permission;
  subCompanies: SubCompany[];
}

interface GroupData {
  id: number;
  name: string;
  accountPlanId: number;
  permission: Permission;
  filiais: Filial[];
}

interface CompanyLevelSelectProps {
  data: GroupData;
  selectedId: number | null;
  onChange: (params: {
    id: number;
    accountPlanId: number;
    type: "group" | "filial" | "sub";
  }) => void;
}

export const CompanyLevelSelect: React.FC<CompanyLevelSelectProps> = ({
  data,
  selectedId,
  onChange,
}) => {
  const [search, setSearch] = useState("");

  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  const [subAnchor, setSubAnchor] = useState<HTMLElement | null>(null);

  const [currentSubs, setCurrentSubs] = useState<SubCompany[]>([]);

  // ====== PAGINAÇÃO ======
  const ITEMS_PER_PAGE = 5;
  const [page, setPage] = useState(0);
  // =======================

  const open = Boolean(anchor);

  const selectedName = useMemo(() => {
    if (selectedId === data.id) return data.name;

    for (const filial of data.filiais) {
      if (filial.id === selectedId) return filial.name;

      const sub = filial.subCompanies.find((s) => s.id === selectedId);
      if (sub) return sub.name;
    }

    return "Selecionar nível";
  }, [selectedId, data]);

  const filteredFiliais = useMemo(() => {
    setPage(0); // reset ao buscar
    return data.filiais.filter((f) =>
      f.name.toLowerCase().includes(search.toLowerCase()),
    );
  }, [data.filiais, search]);

  // Paginação
  const totalPages = Math.ceil(filteredFiliais.length / ITEMS_PER_PAGE);

  const paginatedFiliais = useMemo(() => {
    const start = page * ITEMS_PER_PAGE;
    return filteredFiliais.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredFiliais, page]);

  const selectSub = (sub: SubCompany) => {
    onChange({
      id: sub.id,
      accountPlanId: sub.accountPlanId,
      type: "sub",
    });

    setSubAnchor(null);
    setAnchor(null);
  };

  return (
    <>
      <Button
        fullWidth
        variant="outlined"
        onClick={(e) => setAnchor(e.currentTarget)}
        sx={{
          justifyContent: "flex-start",
          textTransform: "none",
          height: 42,
          borderRadius: "10px",
          border: "1px solid #eee",
          background: "var(--neutral-white)",
          color: "#111",
        }}
      >
        {selectedName}
      </Button>

      {/* MENU PRINCIPAL */}
      <Menu
        anchorEl={anchor}
        open={open}
        onClose={() => setAnchor(null)}
        PaperProps={{
          sx: {
            width: 360,
            borderRadius: "12px",
          },
        }}
      >
        <Box sx={{ px: 2, pt: 1 }}>
          <TextField
            autoFocus
            placeholder="Buscar..."
            size="small"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            fullWidth
          />
        </Box>

        <ListSubheader>Grupo</ListSubheader>

        <MenuItem
          onClick={() => {
            onChange({
              id: data.id,
              accountPlanId: data.accountPlanId,
              type: "group",
            });

            setAnchor(null);
          }}
        >
          {data.name}
        </MenuItem>

        <ListSubheader>Empresas</ListSubheader>

        {paginatedFiliais.map((f) => {
          const hasSubs = f.subCompanies?.length > 0;

          return (
            <MenuItem
              key={f.id}
              disableRipple
              sx={{
                mx: 1,
                borderRadius: "8px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                p: 0,
              }}
            >
              {/* CLIQUE NA FILIAL */}
              <Box
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();

                  onChange({
                    id: f.id,
                    accountPlanId: f.accountPlanId,
                    type: "filial",
                  });

                  setAnchor(null);
                }}
                sx={{
                  flex: 1,
                  py: 1,
                  px: 2,
                  cursor: "pointer",
                }}
              >
                {f.name}
              </Box>

              {/* SUBMENU */}
              {hasSubs && (
                <Box
                  onMouseEnter={(e) => {
                    e.stopPropagation();

                    setSubAnchor(e.currentTarget as HTMLElement);
                    setCurrentSubs(f.subCompanies);
                  }}
                  sx={{
                    px: 1.5,
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    cursor: "pointer",
                  }}
                >
                  <Typography sx={{ fontSize: 12, opacity: 0.6 }}>▶</Typography>
                </Box>
              )}
            </MenuItem>
          );
        })}

        {/* Footer */}
        {totalPages > 0 && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              px: 2,
              py: 1,
              borderTop: "1px solid #eee",
              mt: 1,
            }}
          >
            <Button
              size="small"
              disabled={page === 0}
              onClick={() => setPage((p) => p - 1)}
            >
              <NavigateBeforeIcon fontSize="small" />
            </Button>

            <Typography sx={{ fontSize: 13 }}>
              {page + 1} de {totalPages}
            </Typography>

            <Button
              size="small"
              disabled={page >= totalPages - 1}
              onClick={() => setPage((p) => p + 1)}
            >
              <NavigateNextIcon fontSize="small" />
            </Button>
          </Box>
        )}
      </Menu>

      {/* SUB MENU */}
      <Menu
        anchorEl={subAnchor}
        open={Boolean(subAnchor)}
        onClose={() => setSubAnchor(null)}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
      >
        {currentSubs.map((sub) => (
          <MenuItem key={sub.id} onClick={() => selectSub(sub)}>
            {sub.name}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default CompanyLevelSelect;
