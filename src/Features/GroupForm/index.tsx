import {
  Box,
  Step,
  StepLabel,
  Stepper,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { ModalCustom } from "../../components/Modal";
import { saveGroup } from "../../services/apis/routes/groups.service";
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

interface GroupFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const GroupForm = ({ onClose, isOpen, onSuccess }: GroupFormProps) => {
  const userData = useAuth();
  const { setLoading } = useLoading();
  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: boolean }>({});

  const steps = ["Dados cadastrais", "Endereço", "Contatos"];
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [activeStep, setActiveStep] = useState(0);

  const [formData, setFormData] = useState<GroupFormData>({
    name: "",
    userId: 0,
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
    console.log(errors);

    if (Object.keys(currentErrors).length > 0) return;

    if (activeStep === steps.length - 1) {
      const payload = {
        ...b,
        cnpj: b.cnpj.replace(/\D/g, ""),
        cep: b.cep.replace(/\D/g, ""),
        telefone: b.telefone.replace(/\D/g, ""),
      };
      console.log("Dados enviados:", payload);
    }
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
          setLoading(false); // Finaliza o loading independente do resultado
        });
    }, 500);

    return () => clearTimeout(timeout);
  }, [formData.businessEntity.cep]);

  const onSubmit = async (data: GroupFormData) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValidEmail = emailRegex.test(data.businessEntity.email);

    if (!isValidEmail) {
      setErrors((prev) => ({ ...prev, email: true }));
      return;
    }

    setLoading(true, "Salvando seus dados...");
    try {
      const response = await saveGroup(data);

      // 💡 aqui fazemos a verificação com base na resposta "mascarada"
      if (
        response.success &&
        typeof response.data === "string" &&
        response.data.includes("Já existe um cadastro com este CNPJ")
      ) {
        // marca o campo como inválido
        setErrors((prev) => ({ ...prev, cnpj: true }));
        toast.warning("Já existe um cadastro com este CNPJ.");
        return;
      }

      if (!response.success) {
        setError("Um erro ocorreu ao tentar salvar o Grupo");
        return;
      }

      setError(null);
      onSuccess?.();
      setActiveStep(0);
    } catch (error: unknown) {
      if (
        error instanceof Error &&
        (error as { response?: { status?: number } }).response?.status === 401
      ) {
        toast.error("Erro ao salvar os dados da empresa.");
      }
    } finally {
      setLoading(false);
    }
  };

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
      userId: 0,
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

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <Box sx={{ display: "flex", gap: 2, flexDirection: "column" }}>
            <Typography sx={{ mt: 2, mb: 1 }}>Dados da Empresa</Typography>
            <Box sx={{ display: "flex", gap: 2, flexDirection: "row" }}>
              <Box sx={{ flex: 1 }}>
                <TextField
                  fullWidth
                  label="CNPJ"
                  name="cnpj"
                  value={formData.businessEntity.cnpj}
                  onChange={handleChange}
                  error={Boolean(errors["cnpj"])}
                  helperText={errors["cnpj"] ? "Campo obrigatório" : ""}
                />
              </Box>
              <Box sx={{ flex: 1 }}>
                <TextField
                  fullWidth
                  label="Razão Social"
                  name="razaoSocial"
                  value={formData.businessEntity.razaoSocial}
                  onChange={handleChange}
                  error={Boolean(errors.razaoSocial)}
                  helperText={errors.razaoSocial ? "Campo obrigatório" : ""}
                  disabled
                />
              </Box>
              <Box sx={{ flex: 1 }}>
                <TextField
                  fullWidth
                  label="Nome Fantasia"
                  name="nomeFantasia"
                  value={formData.businessEntity.nomeFantasia}
                  onChange={handleChange}
                  error={Boolean(errors.nomeFantasia)}
                  helperText={errors.nomeFantasia ? "Campo obrigatório" : ""}
                />
              </Box>
            </Box>
          </Box>
        );
      case 1:
        return (
          <Box sx={{ display: "flex", gap: 2, flexDirection: "column" }}>
            <Typography sx={{ mt: 2, mb: 1 }}>Endereço Comercial</Typography>
            <Box sx={{ display: "flex", gap: 2, flexDirection: "row" }}>
              <Box sx={{ flex: 1 }}>
                <TextField
                  fullWidth
                  label="CEP"
                  name="cep"
                  value={formData.businessEntity.cep}
                  onChange={handleChange}
                  error={errors.cep}
                  helperText={errors.cep && "Campo obrigatório"}
                  required
                />
              </Box>
              <Box sx={{ flex: 4 }}>
                <TextField
                  fullWidth
                  label="Endereço"
                  name="logradouro"
                  value={formData.businessEntity.logradouro}
                  onChange={handleChange}
                  error={errors.logradouro}
                  helperText={errors.logradouro && "Campo obrigatório"}
                  required
                />
              </Box>
              <Box sx={{ flex: 1 }}>
                <TextField
                  fullWidth
                  label="numero"
                  name="numero"
                  value={formData.businessEntity.numero}
                  onChange={handleChange}
                  error={errors.numero}
                  helperText={errors.numero && "Campo obrigatório"}
                  required
                />
              </Box>
            </Box>
            <Box sx={{ display: "flex", gap: 2, flexDirection: "row" }}>
              <Box sx={{ flex: 2 }}>
                <TextField
                  fullWidth
                  label="Bairro"
                  name="bairro"
                  value={formData.businessEntity.bairro}
                  onChange={handleChange}
                  error={errors.bairro}
                  helperText={errors.bairro && "Campo obrigatório"}
                  required
                />
              </Box>
              <Box sx={{ flex: 2 }}>
                <TextField
                  fullWidth
                  label="Município"
                  name="municipio"
                  value={formData.businessEntity.municipio}
                  onChange={handleChange}
                  error={errors.municipio}
                  helperText={errors.municipio && "Campo obrigatório"}
                  required
                />
              </Box>
              <Box sx={{ flex: 1 }}>
                <TextField
                  fullWidth
                  label="UF"
                  name="uf"
                  value={formData.businessEntity.uf}
                  onChange={handleChange}
                  error={errors.uf}
                  helperText={errors.uf && "Campo obrigatório"}
                  required
                />
              </Box>
            </Box>
          </Box>
        );
      case 2:
        return (
          <Box sx={{ display: "flex", gap: 2, flexDirection: "column" }}>
            <Typography sx={{ mt: 2, mb: 1 }}>
              Informações de Contato
            </Typography>
            <Box sx={{ display: "flex", gap: 2, flexDirection: "row" }}>
              <Box sx={{ flex: 1 }}>
                <TextField
                  fullWidth
                  label="E-mail"
                  name="email"
                  value={formData.businessEntity.email}
                  onChange={handleChange}
                  error={errors.email}
                  helperText={errors.email && "Campo obrigatório"}
                  required
                />
              </Box>
              <Box sx={{ flex: 1 }}>
                <TextField
                  fullWidth
                  label="DDD + Telefone"
                  name="telefone"
                  value={formData.businessEntity.telefone}
                  onChange={handleChange}
                  error={errors.telefone}
                  helperText={errors.telefone && "Campo obrigatório"}
                  required
                />
              </Box>
            </Box>
          </Box>
        );
      default:
        return null;
    }
  };

  return (
    <ModalCustom
      open={isOpen}
      onClose={handleCancel}
      title="Cadastro de Grupo Empresarial"
      width={"95%"}
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

        <Box sx={{ mt: 3 }}>{renderStepContent()}</Box>

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
