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

export enum WishStatus {
  New = 1,
  Cancelled = 2,
  Done = 3,
  Available = 4,
  Overdue = 5,
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
  status: WishStatus;
}

export interface AccountUserResponse {
  bankBalance: number;
  monthlyCashBalance: number;
  netWealth: number;
  totalObligationsAmount: number;
  listObligation: ObligationView[];
  wishes: WishView[];
}

export enum TransferNetWealthType {
  BalanceBank,
  Obligation,
}

export interface TransferNetWealthCommand {
  type: TransferNetWealthType;
  amountPaid: number;
}
