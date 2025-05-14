import React, { useState } from 'react';
import { TextField, InputAdornment, IconButton, Box, Typography } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

interface PasswordInputProps {
  label?: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  name?: string;
  placeholder?: string;
  required?: boolean;
}

const PasswordInput: React.FC<PasswordInputProps> = ({
  label = 'Password',
  value,
  onChange,
  name = 'password',
  placeholder = 'Placeholder',
  required = false,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev);
  };

  return (
    <Box>
      <Typography
        variant="body2"
        fontWeight={500}
        marginBottom={0.5}
        sx={{ color: 'var(--neutral-700)', fontSize: '16px' }}
      >
        {label}
      </Typography>
      <TextField
        sx={{width: '40%'}}
        required={required}
        name={name}
        type={showPassword ? 'text' : 'password'}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        variant="outlined"
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={togglePasswordVisibility} edge="end">
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
    </Box>
  );
};

export default PasswordInput;
