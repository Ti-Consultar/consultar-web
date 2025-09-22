import { Box, InputAdornment } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import SearchIcon from "@mui/icons-material/Search";
import dayjs, { Dayjs } from "dayjs";
import { useState } from "react";
import { MRPIconButton } from "../../../components/Button/IconButton";

interface MonthYearPickerSearchProps {
  onSearch: (params: { month: number; year: number }) => void;
}

export const MonthYearPickerSearch = ({
  onSearch,
}: MonthYearPickerSearchProps) => {
  const [date, setDate] = useState<Dayjs | null>(dayjs());

  const handleSearch = () => {
    if (date) {
      const month = date.month() + 1; // 0-based index
      const year = date.year();
      onSearch({ month, year });
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box
        display="flex"
        alignItems="center"
        gap={1}
        sx={{
          backgroundColor: "#fff",
          borderRadius: "8px",
          padding: "4px",
          width: "100%",
          maxWidth: 350,
        }}
      >
        <DatePicker
          views={["year", "month"]}
          label=""
          minDate={dayjs("2000-01-01")}
          maxDate={dayjs()}
          value={date}
          onChange={(newValue) => setDate(newValue)}
          format="MM/YYYY"
          slotProps={{
            textField: {
              placeholder: "MM/YYYY",
              variant: "outlined",
              size: "small",
              sx: {
                flex: 1,
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                },
              },
              InputProps: {
                startAdornment: (
                  <InputAdornment position="start">
                    <CalendarMonthIcon />
                  </InputAdornment>
                ),
              },
            },
          }}
        />

        <MRPIconButton
          onClick={handleSearch}
          startIcon={<SearchIcon />}
          title="Pesquisar"
        ></MRPIconButton>
      </Box>
    </LocalizationProvider>
  );
};
