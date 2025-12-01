import { TextField, styled } from "@mui/material";

export const ModernTextField = styled(TextField)(() => ({
  "& .MuiOutlinedInput-root": {
    backgroundColor: "#fff",
    borderRadius: "12px",
    paddingRight: 16,

    "& fieldset": {
      borderColor: "#e0e0e0",
    },
    "&:hover fieldset": {
      borderColor: "#bdbdbd",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#1976d2",
      boxShadow: "0 0 0 2px #1976d230",
    },
  },

  "& .MuiInputBase-input": {
    padding: "10px",
    fontSize: "0.9rem",
  },

  "& .MuiFormLabel-root": {
    fontSize: "0.9rem",
    color: "#777",
  },
}));
