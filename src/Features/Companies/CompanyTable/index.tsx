import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  Typography,
  Box,
} from "@mui/material";
import { useState } from "react";
import { Company } from "../../../types/company";
import {
  formatCNPJ,
  formatPhoneNumberSymbolized,
  formatTelefone,
} from "../../../utils/formatters";
import InboxIcon from "@mui/icons-material/Inbox";
import { useNavigate } from "react-router-dom";

type CompanyTableProps = {
  companies: Company[];
};

export const CompanyTable = ({ companies }: CompanyTableProps) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const navigate = useNavigate();

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleRowClick = (companyId: number) => {
    //navigate(`/empresas/${companyId}`);
  };

  const paginatedCompanies = companies.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>CNPJ</TableCell>
            <TableCell>Nome Fantasia</TableCell>
            <TableCell>Localidade</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Telefone</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {paginatedCompanies.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5}>
                <Box
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  py={4}
                >
                  <InboxIcon fontSize="large" color="disabled" />
                  <Typography variant="body1" color="textSecondary">
                    Nenhuma empresa encontrada.
                  </Typography>
                </Box>
              </TableCell>
            </TableRow>
          ) : (
            paginatedCompanies.map((company) => (
              <TableRow
                key={company.companyId}
                hover
                onClick={() => handleRowClick(company.companyId)}
                style={{ cursor: "pointer" }}
              >
                <TableCell>
                  {formatCNPJ(company.businessEntity?.cnpj)}
                </TableCell>
                <TableCell>{company.companyName}</TableCell>
                <TableCell>{`${company.businessEntity?.municipio}, ${company.businessEntity?.uf}`}</TableCell>
                <TableCell>{company.businessEntity?.email}</TableCell>
                <TableCell>
                  {formatPhoneNumberSymbolized(
                    company.businessEntity?.telefone
                  )}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <TablePagination
        component="div"
        count={companies.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 25, 50]}
        labelRowsPerPage="Linhas por página:"
      />
    </TableContainer>
  );
};
