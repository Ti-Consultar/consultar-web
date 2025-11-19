import React, { useMemo } from "react";
import {
  Select,
  MenuItem,
  ListSubheader,
  FormControl,
  Typography,
  SelectChangeEvent,
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

  return (
    <FormControl fullWidth size="small">
      <Select
        value={selectedId ? `${selectedId}|dummy|dummy` : ""}
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
              boxShadow: "0 4px 12px rgba(255, 0, 0, 0.08)",
            },
          },
        }}
      >
        <ListSubheader>Grupo</ListSubheader>
        <MenuItem
          value={`${data.id}|${data.accountPlanId}|group`}
          sx={{ mx: 1, borderRadius: "8px" }}
        >
          {data.name}
        </MenuItem>

        {data.filiais.length > 0 && <ListSubheader>Filiais</ListSubheader>}

        {data.filiais.map((f) => (
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
