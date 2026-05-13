import {
  Box,
  Step,
  StepButton,
  Stepper,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { ModalCustom } from "../../components/Modal";
import { useLoading } from "../../contexts/LoadingProvider";
import { useEffect, useState } from "react";
import { Button } from "../../components/Button";
import { formatCEP, formatCNPJ, formatTelefone } from "../../utils/formatters";
import { GroupFormData } from "../../types/group";
import {
  getAddressByCep,
  getEmpresaByCnpj,
} from "../../services/apis/routes/consults.service";
import { toast } from "sonner";
import { useAuth } from "../../utils/hooks/useAuth";
import { GroupFormSteps } from "./StepContent";

interface GroupFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  onSubmit: (formData: GroupFormData) => Promise<void>;
  defaultValues?: GroupFormData;
  externalActiveStep?: number;
  title?: string;
  entityLabel?: string;
}

export const CompanyForm = ({
  onClose,
  isOpen,
  defaultValues,
  onSubmit,
  externalActiveStep,
  title,
  entityLabel = "Empresa / Marca",
}: GroupFormProps) => {
  const userData = useAuth();
  const { setLoading } = useLoading();
  const [errors, setErrors] = useState<{ [key: string]: boolean }>({});

  const theme = useTheme();
  const steps = ["Dados cadastrais", "Endereço", "Contatos"];
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [activeStep, setActiveStep] = useState(0);

  const [formData, setFormData] = useState<GroupFormData>(
    defaultValues || {
      name: "",
      businessEntity: {
        nomeFantasia: "",
        razaoSocial: "",
        cnpj: "",
        logradouro: "",
        numero: "",
        bairro: "",
        municipio: "",
        uf: "",
        cep: "",
        telefone: "",
        email: "",
      },
    }
  );

  useEffect(() => {
    if (defaultValues) {
      setFormData(defaultValues);
    }
  }, [defaultValues]);

  useEffect(() => {
    if (externalActiveStep !== undefined) {
      setActiveStep(externalActiveStep);
    }
  }, [externalActiveStep]);

  const validateStep = (step: number) => {
    const currentErrors: { [key: string]: boolean } = {};
    const b = formData.businessEntity;

    if (step === 0) {
      if (!b.cnpj.trim()) currentErrors.cnpj = true;
      if (!b.razaoSocial.trim()) currentErrors.razaoSocial = true;
    } else if (step === 1) {
      if (!b.cep.trim()) currentErrors.cep = true;
      if (!b.logradouro.trim()) currentErrors.logradouro = true;
      if (!b.numero.trim()) currentErrors.numero = true;
      if (!b.bairro.trim()) currentErrors.bairro = true;
      if (!b.municipio.trim()) currentErrors.municipio = true;
      if (!b.uf.trim()) currentErrors.uf = true;
    } else if (step === 2) {
      if (!b.email.trim()) currentErrors.email = true;
      if (!b.telefone.trim()) currentErrors.telefone = true;
    }

    return currentErrors;
  };

  const validateUntilStep = (targetStep: number) => {
    const currentErrors: { [key: string]: boolean } = {};

    for (let step = 0; step <= targetStep; step += 1) {
      Object.assign(currentErrors, validateStep(step));
    }

    setErrors(currentErrors);

    for (let step = 0; step <= targetStep; step += 1) {
      if (Object.keys(validateStep(step)).length > 0) {
        setActiveStep(step);
        return false;
      }
    }

    return true;
  };

  const handleNext = () => {
    if (!validateUntilStep(activeStep)) return;
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleStepClick = (targetStep: number) => {
    if (targetStep <= activeStep) {
      setActiveStep(targetStep);
      return;
    }

    if (!validateUntilStep(targetStep - 1)) return;
    setActiveStep(targetStep);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let newValue = value;

    if (name === "cnpj") newValue = formatCNPJ(value);
    if (name === "cep") newValue = formatCEP(value);
    if (name === "telefone") newValue = formatTelefone(value);

    if (formData.businessEntity.hasOwnProperty(name)) {
      setFormData((prev) => ({
        ...prev,
        businessEntity: {
          ...prev.businessEntity,
          [name]: newValue,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: newValue,
      }));
    }

    setErrors((prev) => ({ ...prev, [name]: false }));
  };

  // Para retornar os dados da empresa ao preencher o CNPJ
  useEffect(() => {
    const rawCnpj = formData.businessEntity.cnpj.replace(/\D/g, "");
    const defaultCnpj = defaultValues?.businessEntity.cnpj?.replace(/\D/g, "");

    if (rawCnpj.length !== 14) return;
    if (defaultCnpj && rawCnpj === defaultCnpj) return;

    const timeout = setTimeout(() => {
      setLoading(true, "Buscando dados da empresa");

      getEmpresaByCnpj(rawCnpj)
        .then((empresa: any) => {
          if (!empresa) return;

          setFormData((prev) => ({
            ...prev,
            businessEntity: {
              ...prev.businessEntity,
              razaoSocial: empresa.nome || "",
              nomeFantasia: empresa.fantasia || "",
            },
          }));
        })
        .catch(() => {
          setFormData((prev) => ({
            ...prev,
            businessEntity: {
              ...prev.businessEntity,
              razaoSocial: "",
              nomeFantasia: "",
            },
          }));
          toast.error(
            "Não foi possível localizar os dados. Verifique se o CNPJ está correto."
          );
        })
        .finally(() => {
          setLoading(false);
        });
    }, 500);

    return () => clearTimeout(timeout);
  }, [formData.businessEntity.cnpj, defaultValues]);

  // Para retornar os dados do endereço ao preencher o CEP
  useEffect(() => {
    const rawCEP = formData.businessEntity.cep.replace(/\D/g, "");

    if (rawCEP.length !== 8) return;

    const timeout = setTimeout(() => {
      setLoading(true, "Buscando seu endereço");

      getAddressByCep(rawCEP)
        .then((cep: any) => {
          if (!cep) return;

          setFormData((prev) => ({
            ...prev,
            businessEntity: {
              ...prev.businessEntity,
              logradouro: cep.logradouro || "",
              bairro: cep.bairro || "",
              municipio: cep.localidade || "",
              uf: cep.uf || "",
            },
          }));
        })
        .catch(() => {
          setFormData((prev) => ({
            ...prev,
            businessEntity: {
              ...prev.businessEntity,
              logradouro: "",
              bairro: "",
              municipio: "",
              uf: "",
            },
          }));
          toast.error("Erro ao buscar o endereço. Verifique o CEP.");
        })
        .finally(() => {
          setLoading(false);
        });
    }, 500);

    return () => clearTimeout(timeout);
  }, [formData.businessEntity.cep]);

  // aplica ações após o envio do formulário;
  const handleSubmit = () => {
    if (!userData) return;
    if (!validateUntilStep(steps.length - 1)) return;

    const {
      nomeFantasia,
      razaoSocial,
      cnpj,
      logradouro,
      numero,
      bairro,
      municipio,
      uf,
      cep,
      telefone,
      email,
    } = formData.businessEntity;

    const cleanCNPJ = cnpj.replace(/\D/g, "");
    const cleanCEP = cep.replace(/\D/g, "");
    const normalizedNomeFantasia = nomeFantasia.trim() || razaoSocial;

    const payload = {
      name: normalizedNomeFantasia,
      userId: Number(userData.userId),
      businessEntity: {
        nomeFantasia: normalizedNomeFantasia,
        razaoSocial,
        cnpj: cleanCNPJ,
        logradouro,
        numero,
        bairro,
        municipio,
        uf,
        cep: cleanCEP,
        telefone,
        email,
      },
    };
    setActiveStep(0);
    onSubmit(payload);
  };

  const handleCancel = () => {
    setFormData({
      name: "",
      groupId: undefined,
      businessEntity: {
        nomeFantasia: "",
        razaoSocial: "",
        cnpj: "",
        logradouro: "",
        numero: "",
        bairro: "",
        municipio: "",
        uf: "",
        cep: "",
        telefone: "",
        email: "",
      },
    });
    setActiveStep(0);
    onClose();
  };

  return (
    <ModalCustom
      open={isOpen}
      onClose={handleCancel}
      title={title}
      width={"min(1080px, calc(100vw - 48px))"}
      height={"min(720px, calc(100vh - 48px))"}
      padding={3}
      onSubmit={handleSubmit}
      hasSaveCancel={false}
    >
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "260px minmax(0, 1fr)",
          gap: 3,
          height: "calc(100% - 56px)",
          minHeight: 0,
        }}
      >
        <Box
          sx={{
            borderRight: isMobile ? "none" : "1px solid #eef0f4",
            borderBottom: isMobile ? "1px solid #eef0f4" : "none",
            pr: isMobile ? 0 : 3,
            pb: isMobile ? 2 : 0,
          }}
        >
          <Stepper activeStep={activeStep} orientation="vertical" nonLinear>
            {steps.map((label, index) => (
              <Step key={label}>
                <StepButton
                  onClick={() => handleStepClick(index)}
                  sx={{
                    alignItems: "flex-start",
                    py: 1,
                    "& .MuiStepLabel-label": {
                      color: "#667085",
                      fontSize: 14,
                      fontWeight: 600,
                    },
                    "& .Mui-active .MuiStepLabel-label": {
                      color: "#3A5F9B",
                      fontWeight: 700,
                    },
                    "& .MuiStepIcon-root": {
                      color: "#d0d5dd",
                    },
                    "& .Mui-active .MuiStepIcon-root": {
                      color: "#3A5F9B",
                    },
                    "& .Mui-completed .MuiStepIcon-root": {
                      color: "#3A5F9B",
                    },
                  }}
                >
                  {label}
                </StepButton>
              </Step>
            ))}
          </Stepper>
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            minHeight: 0,
            overflow: "hidden",
          }}
        >
        <Box sx={{ flex: 1, overflowY: "auto", pr: 1 }}>
          <GroupFormSteps
            activeStep={activeStep}
            formData={formData}
            errors={errors}
            handleChange={handleChange}
            entityLabel={entityLabel}
          />
        </Box>

        <Box
          sx={{
            display: "flex",
            gap: 1,
            justifyContent: "flex-end",
            pt: 3,
            mt: 3,
            borderTop: "1px solid #eef0f4",
          }}
        >
          {activeStep > 0 && (
            <Button variant="secondary" onClick={handleBack} text="Voltar" />
          )}
          {activeStep < steps.length ? (
            <Button
              variant="primary"
              onClick={
                activeStep === steps.length - 1 ? handleSubmit : handleNext
              }
              text={activeStep === steps.length - 1 ? "Salvar" : "Próximo"}
            />
          ) : null}
        </Box>
        </Box>
      </Box>
    </ModalCustom>
  );
};
