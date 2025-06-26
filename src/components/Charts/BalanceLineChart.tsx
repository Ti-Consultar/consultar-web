import { useRef, useState } from "react";
import {
  Paper,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Box,
  Switch,
  Typography,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Button,
} from "@mui/material";
import ZoomOutMapRoundedIcon from "@mui/icons-material/ZoomOutMapRounded";
import ZoomInMapRoundedIcon from "@mui/icons-material/ZoomInMapRounded";
import SlideshowIcon from "@mui/icons-material/Slideshow";
import jsPDF from "jspdf";
import PDFExportIcon from "../../assets/icons/pdf_export.svg";
import PPTExportIcon from "../../assets/icons/ppt_export.svg";
import KeyboardArrowUpOutlinedIcon from "@mui/icons-material/KeyboardArrowUpOutlined";
import KeyboardArrowDownOutlinedIcon from "@mui/icons-material/KeyboardArrowDownOutlined";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
  Tooltip as RechartsTooltip,
} from "recharts";

import Tooltip from "@mui/material/Tooltip";
import html2canvas from "html2canvas";
import PptxGenJS from "pptxgenjs";

interface Entry {
  name: string;
  initialValue: number;
  finalValue: number;
  costCenter: string;
}

interface BalanceLineChartProps {
  data: Entry[];
}

const LineChartContent = ({
  data,
  height = 300,
  darkMode = false,
}: {
  data: Entry[];
  height?: number;
  darkMode?: boolean;
}) => {
  const topLevelData = data
    .filter((item) => item.costCenter.split(".").length <= 2)
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart
        data={topLevelData}
        margin={{ top: 20, right: 30, left: 0, bottom: 80 }}
      >
        <Legend verticalAlign="top" />
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="name"
          angle={-45}
          textAnchor="end"
          interval={0}
          fontSize={"10px"}
          tickFormatter={(name) =>
            name.length > 12 ? name.slice(0, 12) + "..." : name
          }
        />
        <YAxis
          width={100}
          tick={{ fontSize: 12 }}
          tickFormatter={(value) =>
            value.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
              maximumFractionDigits: 0,
            })
          }
        />
        <RechartsTooltip
          contentStyle={{
            backgroundColor: darkMode ? "#2c2c2c" : "#fff",
            border: "1px solid #999",
            color: darkMode ? "#fff" : "#000",
            fontSize: "0.875rem",
            borderRadius: "4px",
          }}
          formatter={(value: number) => `R$ ${value.toLocaleString("pt-BR")}`}
        />
        <Line
          type="basisOpen"
          dataKey="initialValue"
          name="Valor Inicial"
          stroke="var(--branding-default-red)"
          strokeWidth={2}
          dot
        />
        <Line
          type="monotone"
          dataKey="finalValue"
          name="Valor Final"
          stroke="var(--branding-dark-blue)"
          strokeWidth={2}
          dot
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export const BalanceLineChart = ({ data }: BalanceLineChartProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [presentationOpen, setPresentationOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const chartRef = useRef<HTMLDivElement>(null);

  const exportToPPT = async () => {
    if (!chartRef.current) return;

    const canvas = await html2canvas(chartRef.current);
    const imgData = canvas.toDataURL("image/png");

    const pptx = new PptxGenJS();
    const slide = pptx.addSlide();

    slide.addImage({
      data: imgData,
      x: 1,
      y: 1,
      w: 8,
      h: 4.5,
    });

    await pptx.writeFile({ fileName: "grafico.pptx" });
  };

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
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

  const handleExport = (format: "pdf" | "excel" | "ppt") => {
    if (format === "ppt") exportToPPT();
    if (format === "pdf") exportToPDF();
    handleClose();
  };

  return (
    <>
      <Paper
        sx={{ mb: 2, padding: 1, border: "1px solid var(--neutral-200)" }}
        elevation={0}
      >
        <Box display="flex" justifyContent="flex-end">
          <Tooltip title="Modo apresentação">
            <IconButton
              aria-label="presentation"
              onClick={() => setPresentationOpen(true)}
              size="small"
            >
              <SlideshowIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Expandir gráfico">
            <IconButton
              aria-label="expand"
              onClick={() => setDialogOpen(true)}
              size="small"
            >
              <ZoomOutMapRoundedIcon />
            </IconButton>
          </Tooltip>
        </Box>
        <LineChartContent data={data} />
      </Paper>

      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle sx={{ m: 0, p: 2 }}>
          Balanço Contábil - Detalhamento
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
        <DialogContent>
          <LineChartContent data={data} height={500} />
        </DialogContent>
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
          <Typography variant="h6">Balanço Contábil - Detalhamento</Typography>

          <Box display="flex" alignItems="center" gap={2}>
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
        </DialogTitle>

        <DialogContent sx={{ p: 4 }}>
          <Box ref={chartRef}>
            <LineChartContent data={data} height={600} darkMode={darkMode} />
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
};
