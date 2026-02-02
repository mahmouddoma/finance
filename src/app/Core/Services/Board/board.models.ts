export enum ObligationType {
  FixedPayment = 1,
  Installment = 2,
  DebtPayment = 3,
}

export enum BoardTicketStatus {
  Open = 1,
  Done = 2,
  Cancelled = 3,
  Overdue = 4,
}

export enum WalletCategory {
  Cash = 1, // Common convention, but I'll check if enum details were provided
  Bank = 2,
}

export interface WalletDto {
  id: string;
  code: string;
  nameEn?: string;
  nameAr: string;
  category: WalletCategory;
}

export interface ListObligationInstanceDto {
  id: string;
  type: ObligationType;
  title: string;
  amount: number;
  dueDate: string; // DateOnly as string
  wallet: WalletDto;
  status: BoardTicketStatus;
}

export interface ListTicketDto {
  id: string;
  status: BoardTicketStatus;
  title: string;
  amount?: number;
  dueDate: string;
  wallet: WalletDto;
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
}
