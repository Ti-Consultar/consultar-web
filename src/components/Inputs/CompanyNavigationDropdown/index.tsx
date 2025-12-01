import React, { useMemo, useState } from "react";
import {
  Select,
  MenuItem,
  ListSubheader,
  FormControl,
  Typography,
  SelectChangeEvent,
  TextField,
  Box,
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

const CompanyLevelSelect: React.FC<CompanyLevelSelectProps> = ({
  data,
  selectedId,
  onChange,
}) => {
  const [search, setSearch] = useState("");

  const handleSelect = (e: SelectChangeEvent) => {
    const [idStr, accountPlanIdStr, type] = e.target.value.split("|");

    onChange({
      id: Number(idStr),
      accountPlanId: Number(accountPlanIdStr),
      type: type as "group" | "filial" | "sub",
    });
  };

  const selectedName = useMemo(() => {
    if (selectedId === data.id) return data.name;

    for (const filial of data.filiais) {
      if (filial.id === selectedId) return filial.name;
      const sub = filial.subCompanies.find((s) => s.id === selectedId);
      if (sub) return sub.name;
    }

    return "Selecionar nível";
  }, [selectedId, data]);

  // Filtragem
  const filteredFiliais = useMemo(() => {
    return data.filiais.filter((f) =>
      f.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [data.filiais, search]);

  return (
    <FormControl fullWidth size="small">
      <Select
        value={selectedId ? `${selectedId}` : ""}
        onChange={handleSelect}
        displayEmpty
        renderValue={() => (
          <Typography sx={{ fontSize: 14, color: "#111" }}>
            {selectedName}
          </Typography>
        )}
        sx={{
          background: "#fff",
          borderRadius: "10px",
          border: "1px solid #eee",
          height: 42,
          px: 1.5,
          "& .MuiOutlinedInput-notchedOutline": { border: "none" },
        }}
        MenuProps={{
          PaperProps: {
            sx: {
              borderRadius: "12px",
              border: "1px solid #f1f1f1",
              boxShadow: "0 4px 18px rgba(0,0,0,0.08)",
            },
          },
        }}
      >
        {/* Campo de busca */}
        <Box sx={{ px: 2, pt: 1.5, pb: 0.5 }}>
          <TextField
            autoFocus
            placeholder="Buscar..."
            size="small"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            fullWidth
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "8px",
              },
            }}
          />
        </Box>

        {/* Grupo */}
        <ListSubheader disableSticky sx={{ bgcolor: "#fafafa" }}>
          Grupo
        </ListSubheader>
        {(data.name.toLowerCase().includes(search.toLowerCase()) ||
          search === "") && (
          <MenuItem
            value={`${data.id}|${data.accountPlanId}|group`}
            sx={{ mx: 1, borderRadius: "8px" }}
          >
            {data.name}
          </MenuItem>
        )}

        {/* Empresas */}
        {filteredFiliais.length > 0 && (
          <ListSubheader disableSticky sx={{ bgcolor: "#fafafa" }}>
            Empresas
          </ListSubheader>
        )}

        {filteredFiliais.map((f) => (
          <MenuItem
            key={f.id}
            value={`${f.id}|${f.accountPlanId}|filial`}
            sx={{ mx: 1, borderRadius: "8px" }}
          >
            {f.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default CompanyLevelSelect;
