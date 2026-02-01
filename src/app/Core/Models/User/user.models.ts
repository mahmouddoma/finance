export interface ObligationView {
  id: string;
  type: string;
  title: string;
  amount: number;
  dueDay: number;
  startDate: string;
  endDate: string;
  wallet: {
    id: string;
    code: string;
    nameEn: string;
    nameAr: string;
    category: string;
  };
}

export interface AccountUserResponse {
  bankBalance: number;
  monthlyCashBalance: number;
  netWealth: number;
  totalObligationsAmount: number;
  listObligation: ObligationView[];
}
