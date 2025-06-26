import { useRef, useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Bar,
} from "recharts";
import {
  Paper,
  Typography,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Dialog,
  DialogContent,
  DialogTitle,
  Box,
  IconButton,
  Switch,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Tooltip as MuiTooltip,
  Button,
} from "@mui/material";

import SlideshowIcon from "@mui/icons-material/Slideshow";
import ZoomOutMapRoundedIcon from "@mui/icons-material/ZoomOutMapRounded";
import ZoomInMapRoundedIcon from "@mui/icons-material/ZoomInMapRounded";
import PDFExportIcon from "../../assets/icons/pdf_export.svg";
import PPTExportIcon from "../../assets/icons/ppt_export.svg";
import KeyboardArrowUpOutlinedIcon from "@mui/icons-material/KeyboardArrowUpOutlined";
import KeyboardArrowDownOutlinedIcon from "@mui/icons-material/KeyboardArrowDownOutlined";

import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import PptxGenJS from "pptxgenjs";

const seriesOptions = [
  {
    key: "initialValue",
    label: "Valor Inicial",
    color: "url(#initialGradient)",
  },
  { key: "credit", label: "Crédito", color: "url(#creditGradient)" },
  { key: "debit", label: "Débito", color: "url(#debitGradient)" },
  { key: "finalValue", label: "Valor Final", color: "url(#finalGradient)" },
];

type ChartDataItem = {
  id: number;
  costCenter: string;
  name: string;
  initialValue: number;
  credit: number;
  debit: number;
  finalValue: number;
  budgetedAmount: boolean;
};

type GroupedBarChartProps = {
  title?: string;
  data: ChartDataItem[];
};

export const GroupedBarChart = ({ title, data }: GroupedBarChartProps) => {
  const [selectedKeys, setSelectedKeys] = useState<string[]>([
    "initialValue",
    "finalValue",
  ]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [presentationOpen, setPresentationOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const chartRef = useRef<HTMLDivElement>(null);

  const handleToggle = (key: string) => {
    setSelectedKeys((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const exportToPDF = async () => {
    if (!chartRef.current) return;
    const canvas = await html2canvas(chartRef.current);
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("landscape", "pt", "a4");

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    const imgProps = pdf.getImageProperties(imgData);
    const imgRatio = imgProps.width / imgProps.height;

    const maxWidth = pageWidth - 40;
    const maxHeight = pageHeight - 40;

    let imgWidth = maxWidth;
    let imgHeight = maxWidth / imgRatio;

    if (imgHeight > maxHeight) {
      imgHeight = maxHeight;
      imgWidth = maxHeight * imgRatio;
    }

    const x = (pageWidth - imgWidth) / 2;
    const y = (pageHeight - imgHeight) / 2;

    pdf.addImage(imgData, "PNG", x, y, imgWidth, imgHeight);
    pdf.save("grafico.pdf");
  };

  const exportToPPT = async () => {
    if (!chartRef.current) return;
    const canvas = await html2canvas(chartRef.current);
    const imgData = canvas.toDataURL("image/png");

    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    const ratio = imgWidth / imgHeight;

    const slideWidth = 10;
    const maxImgWidth = 8;
    let pptImgWidth = maxImgWidth;
    let pptImgHeight = maxImgWidth / ratio;

    if (pptImgHeight > 5) {
      pptImgHeight = 5;
      pptImgWidth = 5 * ratio;
    }

    const x = (slideWidth - pptImgWidth) / 2;
    const y = 1;

    const pptx = new PptxGenJS();
    const slide = pptx.addSlide();
    slide.addImage({
      data: imgData,
      x,
      y,
      w: pptImgWidth,
      h: pptImgHeight,
    });
    await pptx.writeFile({ fileName: "grafico.pptx" });
  };

  const handleExport = (format: "pdf" | "excel" | "ppt") => {
    if (format === "ppt") exportToPPT();
    if (format === "pdf") exportToPDF();
    handleClose();
  };

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const renderCustomLegend = (props: any) => {
    const { payload } = props;
    return (
      <ul
        style={{ display: "flex", flexWrap: "wrap", paddingLeft: 0, margin: 0 }}
      >
        {payload.map((entry: any, index: number) => {
          const match = seriesOptions.find((s) => s.key === entry.dataKey);
          const color = match?.color.includes("url")
            ? match.color.includes("initial")
              ? "#1976d2"
              : match.color.includes("credit")
              ? "#2e7d32"
              : match.color.includes("debit")
              ? "#d32f2f"
              : match.color.includes("final")
              ? "#f9a825"
              : "#000"
            : match?.color;

          return (
            <li
              key={`item-${index}`}
              style={{
                listStyle: "none",
                display: "flex",
                alignItems: "center",
                marginRight: 16,
                fontSize: 12,
              }}
            >
              <div
                style={{
                  width: 12,
                  height: 12,
                  background: color,
                  marginRight: 8,
                }}
              />
              {entry.value}
            </li>
          );
        })}
      </ul>
    );
  };

  const ChartContent = (
    <div ref={chartRef}>
      <FormGroup row sx={{ mb: 2 }}>
        {seriesOptions.map((option) => (
          <FormControlLabel
            key={option.key}
            control={
              <Checkbox
                checked={selectedKeys.includes(option.key)}
                onChange={() => handleToggle(option.key)}
              />
            }
            label={option.label}
          />
        ))}
      </FormGroup>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={data}
          margin={{ top: 20, right: 20, left: 60, bottom: 20 }}
        >
          <defs>
            <linearGradient id="initialGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1976d2" stopOpacity={1} />
              <stop offset="100%" stopColor="#1976d2" stopOpacity={0.3} />
            </linearGradient>
            <linearGradient id="creditGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2e7d32" stopOpacity={1} />
              <stop offset="100%" stopColor="#2e7d32" stopOpacity={0.3} />
            </linearGradient>
            <linearGradient id="debitGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#d32f2f" stopOpacity={1} />
              <stop offset="100%" stopColor="#d32f2f" stopOpacity={0.3} />
            </linearGradient>
            <linearGradient id="finalGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f9a825" stopOpacity={1} />
              <stop offset="100%" stopColor="#f9a825" stopOpacity={0.3} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis
            width={80}
            tick={{ fontSize: 12 }}
            tickFormatter={(value) =>
              value.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
                maximumFractionDigits: 0,
              })
            }
          />
          <Tooltip />
          <Legend content={renderCustomLegend}/>
          {seriesOptions.map(
            (option) =>
              selectedKeys.includes(option.key) && (
                <Bar
                  key={option.key}
                  dataKey={option.key}
                  name={option.label}
                  fill={option.color}
                />
              )
          )}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );

  if (!Array.isArray(data) || data.length === 0) {
    return (
      <Paper elevation={0} sx={{ py: 8, textAlign: "center", mb: 2 }}>
        <Typography variant="h6" mt={2} color="text.secondary">
          Nenhum dado encontrado.
        </Typography>
        <Typography variant="body2" color="text.secondary" mt={1}>
          Não há dados de balancete para esta data.
        </Typography>
      </Paper>
    );
  }

  return (
    <>
      <Paper
        elevation={0}
        sx={{ padding: 2, border: "1px solid var(--neutral-200)", mb: 2 }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center">
          {title && (
            <Typography variant="h6" gutterBottom>
              {title}
            </Typography>
          )}
          <Box>
            <MuiTooltip title="Modo apresentação">
              <IconButton
                onClick={() => setPresentationOpen(true)}
                size="small"
              >
                <SlideshowIcon />
              </IconButton>
            </MuiTooltip>
            <MuiTooltip title="Expandir gráfico">
              <IconButton onClick={() => setDialogOpen(true)} size="small">
                <ZoomOutMapRoundedIcon />
              </IconButton>
            </MuiTooltip>
          </Box>
        </Box>
        {ChartContent}
      </Paper>

      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle sx={{ m: 0, p: 2 }}>
          Detalhamento do Gráfico
          <IconButton
            aria-label="close"
            onClick={() => setDialogOpen(false)}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <ZoomInMapRoundedIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>{ChartContent}</DialogContent>
      </Dialog>

      <Dialog
        open={presentationOpen}
        onClose={() => setPresentationOpen(false)}
        fullScreen
        PaperProps={{
          sx: {
            background: darkMode
              ? "linear-gradient(to bottom right, #111, #333)"
              : "linear-gradient(to bottom right, #f0f4f8, #fff)",
            color: darkMode ? "#fff" : "#000",
          },
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            p: 2,
            background: darkMode ? "#222" : "#f5f5f5",
            color: darkMode ? "#fff" : "#000",
          }}
        >
          <Box
            display="flex"
            alignItems="center"
            gap={2}
            justifyContent={"space-between"}
            width={"100%"}
          >
            <Typography variant="h6">
              Balanço Contábil - Centro de Custo
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Button
                sx={{ color: darkMode ? "#fff" : "#000" }}
                onClick={handleClick}
                endIcon={
                  open ? (
                    <KeyboardArrowUpOutlinedIcon />
                  ) : (
                    <KeyboardArrowDownOutlinedIcon />
                  )
                }
              >
                Exportar
              </Button>
              <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
                PaperProps={{
                  elevation: 4,
                  sx: {
                    borderRadius: 3,
                    minWidth: 150,
                    p: 1,
                    bgcolor: "background.paper",
                    boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
                  },
                }}
              >
                <MenuItem onClick={() => handleExport("pdf")}>
                  <ListItemIcon>
                    <img src={PDFExportIcon} style={{ width: "20px" }} />
                  </ListItemIcon>
                  <ListItemText>.PDF</ListItemText>
                </MenuItem>
                <MenuItem onClick={() => handleExport("ppt")}>
                  <ListItemIcon>
                    <img src={PPTExportIcon} style={{ width: "20px" }} />
                  </ListItemIcon>
                  <ListItemText>PowerPoint</ListItemText>
                </MenuItem>
              </Menu>
              <Typography variant="body2">
                {darkMode ? "Tema Escuro" : "Tema Claro"}
              </Typography>
              <Switch
                checked={darkMode}
                onChange={() => setDarkMode(!darkMode)}
              />
              <IconButton onClick={() => setPresentationOpen(false)}>
                <ZoomInMapRoundedIcon
                  sx={{ color: darkMode ? "#fff" : "#000" }}
                />
              </IconButton>
            </Box>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ p: 4 }}>{ChartContent}</DialogContent>
      </Dialog>
    </>
  );
};
