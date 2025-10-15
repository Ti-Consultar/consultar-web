import { useState, useRef } from "react";
import { Box, IconButton, Typography } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Dayjs } from "dayjs";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

type MonthNavigatorProps = {
  value: Dayjs | null;
  onChange: (newValue: Dayjs | null, month?: number, year?: number) => void;
  shouldDisableMonth?: (month: Dayjs) => boolean;
};

export const MonthNavigator = ({
  value,
  onChange,
  shouldDisableMonth,
}: MonthNavigatorProps) => {
  const [open, setOpen] = useState(false);
  const [tempValue, setTempValue] = useState<Dayjs | null>(value);
  const anchorRef = useRef<HTMLSpanElement | null>(null);

  const prevMonth = value ? value.subtract(1, "month") : null;
  const nextMonth = value ? value.add(1, "month") : null;

  const isPrevDisabled =
    !prevMonth || (shouldDisableMonth ? shouldDisableMonth(prevMonth) : false);
  const isNextDisabled =
    !nextMonth || (shouldDisableMonth ? shouldDisableMonth(nextMonth) : false);

  const handleAccept = (newValue: Dayjs | null) => {
    if (newValue) {
      const month = newValue.month() + 1;
      const year = newValue.year();
      onChange(newValue, month, year);
    } else {
      onChange(null);
    }
    setOpen(false);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <IconButton
          onClick={() => prevMonth && handleAccept(prevMonth)}
          disabled={isPrevDisabled}
        >
          <ArrowBackIosNewIcon fontSize="small" />
        </IconButton>

        <Typography
          ref={anchorRef}
          variant="subtitle1"
          sx={{ cursor: "pointer", minWidth: 120, textAlign: "center" }}
          onClick={() => setOpen(true)}
        >
          {value ? value.format("MMMM/YYYY") : "Selecionar mês"}
        </Typography>

        <IconButton
          onClick={() => nextMonth && handleAccept(nextMonth)}
          disabled={isNextDisabled}
        >
          <ArrowForwardIosIcon fontSize="small" />
        </IconButton>

        <DatePicker
          open={open}
          onClose={() => setOpen(false)}
          views={["year", "month"]}
          openTo="month"
          value={tempValue}
          onChange={(newValue) => setTempValue(newValue)} 
          onAccept={handleAccept}
          shouldDisableMonth={shouldDisableMonth}
          slotProps={{
            textField: { style: { display: "none" } },
            popper: { anchorEl: anchorRef.current },
          }}
        />
      </Box>
    </LocalizationProvider>
  );
};
