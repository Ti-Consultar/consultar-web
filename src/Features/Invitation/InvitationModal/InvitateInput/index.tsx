import { Chip, FormControl, styled } from "@mui/material";
import { useRef, useState, KeyboardEvent } from "react";

interface MultiEmailEditableInputProps {
  emails: string[];
  onEmailsChange: (emails: string[]) => void;
}

const EditableDiv = styled("div")(({ theme }) => ({
  width: "100%",
  minHeight: "80px",
  padding: "6px 8px",
  border: "1px solid rgba(0, 0, 0, 0.23)",
  borderRadius: theme.shape.borderRadius,
  display: "flex",
  flexWrap: "wrap",
  alignItems: "flex-start",
  gap: "6px",
  fontFamily: theme.typography.fontFamily,
  fontSize: theme.typography.body2.fontSize,
  outline: "none",
  cursor: "text",
}));

export const MultiEmailEditableInput = ({
  emails,
  onEmailsChange,
}: MultiEmailEditableInputProps) => {
  const inputRef = useRef<HTMLSpanElement>(null);
  const [inputValue, setInputValue] = useState("");

  const addEmail = (raw: string) => {
    const trimmed = raw.trim().replace(/,$/, "");
    const isValidEmail = /\S+@\S+\.\S+/.test(trimmed);

    if (isValidEmail && !emails.includes(trimmed)) {
      onEmailsChange([...emails, trimmed]);
    }

    setInputValue("");
    if (inputRef.current) {
      inputRef.current.innerText = "";
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const key = e.key;

    if (key === "Enter" || key === "," || key === " ") {
      e.preventDefault();
      if (inputValue.trim()) {
        addEmail(inputValue);
      }
    } else if (key === "Backspace" && inputValue === "") {
      onEmailsChange(emails.slice(0, -1));
    }
  };

  const handleInput = () => {
    if (inputRef.current) {
      const text = inputRef.current.innerText;
      setInputValue(text);
    }
  };

  const handleDelete = (emailToDelete: string) => {
    onEmailsChange(emails.filter((email) => email !== emailToDelete));
  };

  return (
    <FormControl fullWidth>
      <EditableDiv
        contentEditable={false}
        onClick={() => inputRef.current?.focus()}
        onKeyDown={handleKeyDown}
      >
        {emails.map((email) => (
          <Chip
            key={email}
            label={email}
            onDelete={() => handleDelete(email)}
            size="small"
          />
        ))}
        <span
          ref={inputRef}
          contentEditable
          onInput={handleInput}
          style={{
            minWidth: 100,
            outline: "none",
            display: "inline-block",
            whiteSpace: "pre",
          }}
        />
      </EditableDiv>
    </FormControl>
  );
};
