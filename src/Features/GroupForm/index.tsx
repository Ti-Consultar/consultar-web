import {
  Box,
  Step,
  StepLabel,
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
import { toast } from "react-toastify";
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
}

export const CompanyForm = ({
  onClose,
  isOpen,
  defaultValues,
  onSubmit,
  externalActiveStep,
  title
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

  const handleNext = () => {
    const currentErrors: { [key: string]: boolean } = {};
    const b = formData.businessEntity;

    if (activeStep === 0) {
      if (!b.cnpj.trim()) currentErrors.cnpj = true;
      if (!b.razaoSocial.trim()) currentErrors.razaoSocial = true;
    } else if (activeStep === 1) {
      if (!b.cep.trim()) currentErrors.cep = true;
      if (!b.logradouro.trim()) currentErrors.logradouro = true;
      if (!b.numero.trim()) currentErrors.numero = true;
      if (!b.bairro.trim()) currentErrors.bairro = true;
      if (!b.municipio.trim()) currentErrors.municipio = true;
      if (!b.uf.trim()) currentErrors.uf = true;
    } else if (activeStep === 2) {
      if (!b.email.trim()) currentErrors.email = true;
      if (!b.telefone.trim()) currentErrors.telefone = true;
    }

    setErrors({ ...currentErrors });

    if (Object.keys(currentErrors).length > 0) return;
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
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

    if (rawCnpj.length !== 14) return;

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
  }, [formData.businessEntity.cnpj]);

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

    const payload = {
      name: nomeFantasia || razaoSocial,
      userId: Number(userData.userId),
      businessEntity: {
        nomeFantasia,
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
      width={"80%"}
      onSubmit={handleSubmit}
      hasSaveCancel={false}
    >
      <Box sx={{ width: "100%", p: 2 }}>
        <Stepper
          activeStep={activeStep}
          orientation={isMobile ? "vertical" : "horizontal"}
        >
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <Box sx={{ mt: 3 }}>
          <GroupFormSteps
            activeStep={activeStep}
            formData={formData}
            errors={errors}
            handleChange={handleChange}
          />
        </Box>

        <Box
          sx={{ mt: 4, display: "flex", gap: 1, justifyContent: "flex-end" }}
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
              text={activeStep === steps.length - 1 ? "Enviar" : "Próximo"}
            />
          ) : null}
        </Box>
      </Box>
    </ModalCustom>
  );
};
