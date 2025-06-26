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
} from "@mui/material";

import FileDownloadIcon from "@mui/icons-material/FileDownload";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import InsertChartIcon from "@mui/icons-material/InsertChart";
import DescriptionIcon from "@mui/icons-material/Description";
import SlideshowIcon from "@mui/icons-material/Slideshow";
import ZoomOutMapRoundedIcon from "@mui/icons-material/ZoomOutMapRounded";
import ZoomInMapRoundedIcon from "@mui/icons-material/ZoomInMapRounded";

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
    pdf.addImage(imgData, "PNG", 20, 20, pageWidth - 40, pageHeight - 40);
    pdf.save("grafico.pdf");
  };

  const exportToPPT = async () => {
    if (!chartRef.current) return;
    const canvas = await html2canvas(chartRef.current);
    const imgData = canvas.toDataURL("image/png");
    const pptx = new PptxGenJS();
    const slide = pptx.addSlide();
    slide.addImage({ data: imgData, x: 1, y: 1, w: 8, h: 4.5 });
    await pptx.writeFile({ fileName: "grafico.pptx" });
  };

  const exportToExcel = () => {
    const header = [
      "Nome",
      "Valor Inicial",
      "Crédito",
      "Débito",
      "Valor Final",
      "Centro de Custo",
    ];
    const rows = data.map((item) => [
      item.name,
      item.initialValue,
      item.credit,
      item.debit,
      item.finalValue,
      item.costCenter,
    ]);

    let csvContent =
      "data:text/csv;charset=utf-8," +
      [header, ...rows].map((e) => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "grafico.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExport = (format: "pdf" | "excel" | "ppt") => {
    if (format === "ppt") exportToPPT();
    if (format === "pdf") exportToPDF();
    if (format === "excel") exportToExcel();
    handleClose();
  };

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
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
          <Legend />
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
          <Box display="flex" alignItems="center" gap={2} justifyContent={"space-between"} width={'100%'}>
            <Typography variant="h6">
              Balanço Contábil - Centro de Custo
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <MuiTooltip title="Exportar">
                <IconButton onClick={handleClick}>
                  <FileDownloadIcon />
                </IconButton>
              </MuiTooltip>
              <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
              >
                <MenuItem onClick={() => handleExport("excel")}>
                  <ListItemIcon>
                    <InsertChartIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Exportar Excel</ListItemText>
                </MenuItem>
                <MenuItem onClick={() => handleExport("pdf")}>
                  <ListItemIcon>
                    <PictureAsPdfIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Exportar PDF</ListItemText>
                </MenuItem>
                <MenuItem onClick={() => handleExport("ppt")}>
                  <ListItemIcon>
                    <DescriptionIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Exportar PPT</ListItemText>
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
