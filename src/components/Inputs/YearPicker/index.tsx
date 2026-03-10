import { DatePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { ModernTextField } from "../../../styles/DatePicker";

interface YearPickerProps {
  year: number;
  onChange: (year: number) => void;
  label?: string;
}

export default function YearPicker({
  year,
  onChange,
  label = "Ano",
}: YearPickerProps) {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        views={["year"]}
        label={label}
        value={dayjs().year(year)}
        onChange={(v) => {
          if (v) onChange(v.year());
        }}
        enableAccessibleFieldDOMStructure={false}
        slots={{
          textField: ModernTextField,
        }}
        slotProps={{
          textField: { size: "medium" },
        }}
      />
    </LocalizationProvider>
  );
}
