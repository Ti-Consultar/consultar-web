import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Dayjs } from "dayjs";

type MonthDateInputProps = {
  label?: string;
  value: Dayjs | null;
  onChange: (newValue: Dayjs | null) => void;
  size?: "small" | "medium";
};

export const MonthDateInput = ({
  label = "Mês",
  value,
  onChange,
  size = "small",
}: MonthDateInputProps) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        views={["month"]}
        label={label}
        value={value}
        onChange={onChange}
        slotProps={{ textField: { size } }}
      />
    </LocalizationProvider>
  );
};
