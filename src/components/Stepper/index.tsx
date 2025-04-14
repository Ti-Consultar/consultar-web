import React from "react";
import {
  Stepper,
  Step,
  StepLabel,
  Box,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Button } from "../Button";

const steps = ["Selecionar empresa", "Escolher grupo", "Confirmar dados"];

const ResponsiveStepper = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [activeStep, setActiveStep] = React.useState(0);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  return (
    <Box sx={{ width: "100%", p: 2 }}>
      <Stepper
        activeStep={activeStep}
        orientation={isMobile ? "vertical" : "horizontal"}
      >
        {steps.map((label, index) => (
          <Step key={index}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Box sx={{ mt: 2 }}>
        {activeStep === steps.length ? (
          <>
            <Typography>Todos os passos foram concluídos!</Typography>
            <Button onClick={handleReset} variant="primary" text="Salvar"  />
          </>
        ) : (
          <>
            <Typography sx={{ mb: 1 }}>
              Etapa {activeStep + 1}: {steps[activeStep]}
            </Typography>
            <Box sx={{ display: "flex", gap: 1 }}>
              <Button
                variant="tertiary"
                disabled={activeStep === 0}
                onClick={handleBack}
                text="Voltar"
              ></Button>
              <Button
                variant="primary"
                onClick={handleNext}
                text={activeStep === steps.length - 1 ? "Finalizar" : "Próximo"}
              ></Button>
            </Box>
          </>
        )}
      </Box>
    </Box>
  );
};

export default ResponsiveStepper;
