import { useState, useRef } from "react";
import { Box, IconButton, Typography } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Dayjs } from "dayjs";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

type MonthNavigatorProps = {
  value: Dayjs | null;
  onChange: (newValue: Dayjs | null) => void;
  shouldDisableMonth?: (month: Dayjs) => boolean;
};

export const MonthNavigator = ({
  value,
  onChange,
  shouldDisableMonth,
}: MonthNavigatorProps) => {
  const [open, setOpen] = useState(false);
  const anchorRef = useRef<HTMLSpanElement | null>(null);

  const prevMonth = value ? value.subtract(1, "month") : null;
  const nextMonth = value ? value.add(1, "month") : null;

  const isPrevDisabled =
    !prevMonth || (shouldDisableMonth ? shouldDisableMonth(prevMonth) : false);
  const isNextDisabled =
    !nextMonth || (shouldDisableMonth ? shouldDisableMonth(nextMonth) : false);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <IconButton
          onClick={() => prevMonth && onChange(prevMonth)}
          disabled={isPrevDisabled}
        >
          <ArrowBackIosNewIcon fontSize="small" />
        </IconButton>

        {/* Âncora do calendário */}
        <Typography
          ref={anchorRef}
          variant="subtitle1"
          sx={{ cursor: "pointer", minWidth: 120, textAlign: "center" }}
          onClick={() => setOpen(true)}
        >
          {value ? value.format("MMMM/YYYY") : "Selecionar mês"}
        </Typography>

        <IconButton
          onClick={() => nextMonth && onChange(nextMonth)}
          disabled={isNextDisabled}
        >
          <ArrowForwardIosIcon fontSize="small" />
        </IconButton>

        {/* Picker oculto */}
        <DatePicker
          open={open}
          onClose={() => setOpen(false)}
          views={["month"]}
          value={value}
          onChange={(newValue) => {
            onChange(newValue);
            setOpen(false);
          }}
          shouldDisableMonth={shouldDisableMonth}
          slotProps={{
            textField: { style: { display: "none" } },
            popper: { anchorEl: anchorRef.current }, // ✅ ancora no texto
          }}
        />
      </Box>
    </LocalizationProvider>
  );
};
