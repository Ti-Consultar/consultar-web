export interface Classification {
  id: number;
  name: string;
  value: number;
  valueFormatted: string;
}

export interface GroupData {
  value: number;
  classifications: Classification[];
}

export interface MonthlyData {
  month: string;
  totalAtivoCirculante: GroupData;
  totalLongoPrazo: GroupData;
  totalPermanente: GroupData;
  totalAtivoNaoCirculante: GroupData;
  totalGeralDoAtivo: {
    value: number;
  };
}

export interface BalancoResponse {
  data: {
    year: number;
    meses: MonthlyData[];
  };
}
