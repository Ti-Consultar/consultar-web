import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

interface TableDetailModalProps {
  openModal: boolean;
  handleCloseModal: () => void;
  selectedTitle: string;
  selectedData: any[];
}

export const TableDetailModal = ({
  handleCloseModal,
  openModal,
  selectedData,
  selectedTitle,
}: TableDetailModalProps) => {
  return (
    <Dialog open={openModal} onClose={handleCloseModal} maxWidth="md" fullWidth>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          pr: 2,
        }}
      >
        <DialogTitle p={0}>{selectedTitle}</DialogTitle>
        <Box>
          <IconButton
            onClick={handleCloseModal}
            aria-label="Fechar detalhamento"
          >
            <CloseRoundedIcon />
          </IconButton>
        </Box>
      </Box>
      <DialogContent>
        <TableContainer
          sx={{ border: "1px solid var(--neutral-200)", borderRadius: "8px" }}
        >
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Nome</TableCell>
                <TableCell align="right">Valor Final</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {selectedData.map((data) => (
                <TableRow key={data.id}>
                  <TableCell>{data.name}</TableCell>
                  <TableCell align="right">
                    <Typography fontFamily="monospace">{data.value}</Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>
    </Dialog>
  );
};
