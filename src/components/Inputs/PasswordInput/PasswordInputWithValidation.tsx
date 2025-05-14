import React, { useState } from 'react';
import {
  TextField,
  InputAdornment,
  IconButton,
  Typography,
  Box,
  Stack,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

interface PasswordInputProps {
  label?: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  name?: string;
  placeholder?: string;
  required?: boolean;
}

const PasswordInputWithValidation: React.FC<PasswordInputProps> = ({
  label = 'Current Password',
  value,
  onChange,
  name = 'password',
  placeholder = 'Current Password',
  required = false,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev);
  };

  // Validações
  const isMinLength = value.length >= 8;
  const hasNumber = /\d/.test(value);
  const hasUppercase = /[A-Z]/.test(value);

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

      <Stack spacing={0.5} mt={1}>
        <Typography variant="caption" color={isMinLength ? 'var(--status-success-500)' : 'text.secondary'}>
          • Deve conter pelo menos 8 caracteres
        </Typography>
        <Typography variant="caption" color={hasNumber ? 'var(--status-success-500)' : 'text.secondary'}>
          • Deve ter ao menos um número
        </Typography>
        <Typography variant="caption" color={hasUppercase ? 'var(--status-success-500)' : 'text.secondary'}>
          • Deve conter uma letra maiúsculo
        </Typography>
      </Stack>
    </Box>
  );
};

export default PasswordInputWithValidation;
