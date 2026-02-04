export enum ObligationType {
  FixedPayment = 1,
  Installment = 2,
  DebtPayment = 3,
  SafityPayment = 4,
}

export enum BoardTicketStatus {
  Open = 1,
  Done = 2,
  Cancelled = 3,
  Overdue = 4,
}

export enum WalletCategory {
  Cash = 1,
  Bank = 2,
}

export interface WalletDto {
  id: string;
  code: string;
  nameEn?: string;
  nameAr: string;
  category: WalletCategory | string;
}

export interface ListObligationInstanceDto {
  id: string;
  type: ObligationType | string;
  title: string;
  amount: number;
  dueDate: string;
  wallet: WalletDto;
  status: BoardTicketStatus | string;
  paidAmount?: number | null;
  paidAtUtc?: string | null;
}

export interface ListTicketDto {
  id: string;
  status: BoardTicketStatus | string;
  title: string;
  amount?: number;
  dueDate: string;
  wallet: WalletDto;
  paidAmount?: number | null;
  paidAtUtc?: string | null;
  weekNumber?: number;
}

export interface WalletPaidSummaryDto {
  walletId: string;
  wallet: WalletDto;
  paidObligationsTotal: number;
  paidTicketsTotal: number;
  totalPaid: number;
}

export interface LedgerMovementDto {
  id: string;
  walletId: string;
  wallet: WalletDto;
  type: string;
  amount: number;
  occurredOn: string;
  createdAtUtc: string;
  obligationInstanceId?: string | null;
  boardTicketId?: string | null;
}

export interface WalletMinimalDto {
  id: string;
  nameEn?: string;
  nameAr: string;
}

export interface AddTicketRequest {
  boardId: string;
  walletId: string;
  title: string;
  dueDate: string;
  amount: number;
}

export interface GetBoardDetailsResponse {
  boardId: string;
  year: number;
  month: number;
  totalObligationsAmount?: number;
  restAmount?: number;
  monthlyCashBalance: number;
  obligationInstances: ListObligationInstanceDto[];
  tickets: ListTicketDto[];
  walletPaidSummaries?: WalletPaidSummaryDto[];
  ledgerMovements?: LedgerMovementDto[];
}
export interface PayTicketRequest {
  boardId: string;
  ticketId: string;
  walletId: string;
  paidAmount: number;
  occurredOn: string;
}

export interface PayObligationRequest {
  boardId: string;
  obligationInstanceId: string;
  walletId: string;
  paidAmount: number;
  occurredOn: string;
}

export interface TransferSafityRequest {
  boardId: string;
  obligationInstanceId: string;
  walletId: string;
  paidAmount: number;
  occurredOn: string;
}
