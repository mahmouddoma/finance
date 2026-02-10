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

export interface WishView {
  id: string;
  name: string;
  targetAmount: number;
  paidAmount: number | null;
  paidAtUtc: string | null;
  priority: 'Low' | 'Medium' | 'High';
  desiredOn: string | null;
  notes: string | null;
  status: 'Available' | 'Fulfilled' | 'Cancelled' | 'New';
}

export interface AccountUserResponse {
  bankBalance: number;
  monthlyCashBalance: number;
  netWealth: number;
  totalObligationsAmount: number;
  listObligation: ObligationView[];
  wishes: WishView[];
}
