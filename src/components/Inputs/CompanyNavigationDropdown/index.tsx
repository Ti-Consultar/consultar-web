import React, { useMemo, useState } from "react";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SearchIcon from "@mui/icons-material/Search";
import {
  Button,
  Menu,
  MenuItem,
  ListSubheader,
  TextField,
  Box,
  Typography,
  InputAdornment,
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
    parentId?: number;
  }) => void;
}

type CompanyListItem =
  | {
      type: "filial";
      filial: Filial;
    }
  | {
      type: "sub";
      sub: SubCompany;
      parent: Filial;
    };

export const CompanyLevelSelect: React.FC<CompanyLevelSelectProps> = ({
  data,
  selectedId,
  onChange,
}) => {
  const [search, setSearch] = useState("");
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);

  const [activeFilial, setActiveFilial] = useState<Filial | null>(null);
  const [view, setView] = useState<"companies" | "units">("companies");

  const ITEMS_PER_PAGE = 5;
  const [page, setPage] = useState(0);

  const open = Boolean(anchor);

  const normalizedSearch = search.trim().toLowerCase();

  const selectedName = useMemo(() => {
    if (selectedId === data.id) return data.name;

    for (const filial of data.filiais) {
      if (filial.id === selectedId) return filial.name;

      const sub = filial.subCompanies.find((s) => s.id === selectedId);
      if (sub) return sub.name;
    }

    return "Selecionar nível";
  }, [selectedId, data]);

  const companyItems = useMemo<CompanyListItem[]>(() => {
    if (!normalizedSearch) {
      return data.filiais.map((filial) => ({ type: "filial", filial }));
    }

    return data.filiais.flatMap((filial) => {
      const filialMatches = filial.name
        .toLowerCase()
        .includes(normalizedSearch);

      const subMatches = filial.subCompanies
        ?.filter((sub) => sub.name.toLowerCase().includes(normalizedSearch))
        .map((sub) => ({ type: "sub" as const, sub, parent: filial }));

      return [
        ...(filialMatches ? [{ type: "filial" as const, filial }] : []),
        ...(subMatches ?? []),
      ];
    });
  }, [data.filiais, normalizedSearch]);

  const filteredUnits = useMemo(() => {
    if (!activeFilial) return [];

    if (!normalizedSearch) return activeFilial.subCompanies;

    return activeFilial.subCompanies.filter((sub) =>
      sub.name.toLowerCase().includes(normalizedSearch),
    );
  }, [activeFilial, normalizedSearch]);

  const listToPaginate = view === "companies" ? companyItems : filteredUnits;
  const totalPages = Math.ceil(listToPaginate.length / ITEMS_PER_PAGE);

  const paginatedItems = useMemo(() => {
    const start = page * ITEMS_PER_PAGE;
    return listToPaginate.slice(start, start + ITEMS_PER_PAGE);
  }, [listToPaginate, page]);

  const closeMenu = () => {
    setAnchor(null);
    setSearch("");
    setPage(0);
    setView("companies");
    setActiveFilial(null);
  };

  const openUnits = (filial: Filial) => {
    setActiveFilial(filial);
    setView("units");
    setSearch("");
    setPage(0);
  };

  const backToCompanies = () => {
    setView("companies");
    setActiveFilial(null);
    setSearch("");
    setPage(0);
  };

  const itemSx = {
    mx: 1,
    my: 0.25,
    borderRadius: "8px",
    minHeight: 42,
    transition: "all 0.15s ease",
    "&:hover": {
      backgroundColor: "#f5f7fb",
    },
  };

  const selectedSx = {
    backgroundColor: "#eef3ff",
    fontWeight: 600,
    "&:hover": {
      backgroundColor: "#e6eeff",
    },
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
          px: 2,
        }}
      >
        {selectedName}
      </Button>

      <Menu
        anchorEl={anchor}
        open={open}
        onClose={closeMenu}
        disableAutoFocusItem
        MenuListProps={{
          autoFocusItem: false,
          disableListWrap: true,
        }}
        PaperProps={{
          sx: {
            width: 360,
            borderRadius: "12px",
            overflow: "hidden",
            boxShadow: "0 8px 28px rgba(0,0,0,0.12)",
          },
        }}
      >
        {view === "units" && activeFilial && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              px: 1,
              py: 1,
              borderBottom: "1px solid #eee",
            }}
          >
            <Button
              size="small"
              onClick={backToCompanies}
              sx={{
                minWidth: 32,
                borderRadius: "8px",
              }}
            >
              <ArrowBackIcon fontSize="small" />
            </Button>

            <Box>
              <Typography sx={{ fontSize: 13, color: "#667085" }}>
                Unidades de
              </Typography>
              <Typography sx={{ fontSize: 14, fontWeight: 600 }}>
                {activeFilial.name}
              </Typography>
            </Box>
          </Box>
        )}

        <Box sx={{ px: 2, pt: 1.5, pb: 1 }}>
          <TextField
            autoFocus
            placeholder={
              view === "companies"
                ? "Buscar grupo, empresa ou unidade..."
                : "Buscar unidade..."
            }
            size="small"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(0);
            }}
            onKeyDown={(e) => {
              e.stopPropagation();
            }}
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        {view === "companies" && (
          <>
            {!normalizedSearch && (
              <>
                <ListSubheader>Grupo</ListSubheader>

                <MenuItem
                  selected={selectedId === data.id}
                  onClick={() => {
                    onChange({
                      id: data.id,
                      accountPlanId: data.accountPlanId,
                      type: "group",
                    });
                    closeMenu();
                  }}
                  sx={{
                    ...itemSx,
                    ...(selectedId === data.id ? selectedSx : {}),
                  }}
                >
                  {data.name}
                </MenuItem>
              </>
            )}

            <ListSubheader>Empresas / Marcas</ListSubheader>

            {(paginatedItems as CompanyListItem[]).map((item) => {
              if (item.type === "sub") {
                const { sub, parent } = item;
                const isSelected = selectedId === sub.id;

                return (
                  <MenuItem
                    key={`${parent.id}-${sub.id}`}
                    selected={isSelected}
                    onClick={() => {
                      onChange({
                        id: sub.id,
                        accountPlanId: sub.accountPlanId,
                        type: "sub",
                        parentId: parent.id,
                      });
                      closeMenu();
                    }}
                    sx={{
                      ...itemSx,
                      ...(isSelected ? selectedSx : {}),
                    }}
                  >
                    <Box>
                      <Typography sx={{ fontSize: 14 }}>{sub.name}</Typography>
                      <Typography sx={{ fontSize: 12, color: "#667085" }}>
                        {parent.name}
                      </Typography>
                    </Box>
                  </MenuItem>
                );
              }

              const filial = item.filial;
              const hasSubs = filial.subCompanies?.length > 0;
              const isSelected = selectedId === filial.id;

              return (
                <MenuItem
                  key={filial.id}
                  disableRipple
                  sx={{
                    ...itemSx,
                    ...(isSelected ? selectedSx : {}),
                    p: 0,
                    display: "flex",
                  }}
                >
                  <Box
                    onClick={() => {
                      onChange({
                        id: filial.id,
                        accountPlanId: filial.accountPlanId,
                        type: "filial",
                      });
                      closeMenu();
                    }}
                    sx={{
                      flex: 1,
                      px: 2,
                      py: 1.2,
                      cursor: "pointer",
                    }}
                  >
                    <Typography sx={{ fontSize: 14 }}>{filial.name}</Typography>

                    {hasSubs && (
                      <Typography sx={{ fontSize: 12, color: "#667085" }}>
                        {filial.subCompanies.length} unidade(s)
                      </Typography>
                    )}
                  </Box>

                  {hasSubs && (
                    <Box
                      onClick={(e) => {
                        e.stopPropagation();
                        openUnits(filial);
                      }}
                      sx={{
                        px: 1.5,
                        alignSelf: "stretch",
                        display: "flex",
                        alignItems: "center",
                        cursor: "pointer",
                        borderLeft: "1px solid #f1f1f1",
                        "&:hover": {
                          backgroundColor: "#eef3ff",
                        },
                      }}
                    >
                      <NavigateNextIcon fontSize="small" />
                    </Box>
                  )}
                </MenuItem>
              );
            })}
          </>
        )}

        {view === "units" && activeFilial && (
          <>
            <ListSubheader>Unidades</ListSubheader>

            {paginatedItems.map((item) => {
              const sub = item as SubCompany;
              const isSelected = selectedId === sub.id;

              return (
                <MenuItem
                  key={sub.id}
                  selected={isSelected}
                  onClick={() => {
                    onChange({
                      id: sub.id,
                      accountPlanId: sub.accountPlanId,
                      type: "sub",
                      parentId: activeFilial.id,
                    });
                    closeMenu();
                  }}
                  sx={{
                    ...itemSx,
                    ...(isSelected ? selectedSx : {}),
                  }}
                >
                  <Box>
                    <Typography sx={{ fontSize: 14 }}>{sub.name}</Typography>
                    <Typography sx={{ fontSize: 12, color: "#667085" }}>
                      {activeFilial.name}
                    </Typography>
                  </Box>
                </MenuItem>
              );
            })}
          </>
        )}

        {paginatedItems.length === 0 && (
          <Box sx={{ px: 2, py: 3, textAlign: "center" }}>
            <Typography sx={{ fontSize: 14, color: "#667085" }}>
              Nenhum resultado encontrado.
            </Typography>
          </Box>
        )}

        {totalPages > 1 && (
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
    </>
  );
};

export default CompanyLevelSelect;
