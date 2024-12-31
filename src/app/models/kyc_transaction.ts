export interface KycTransaction {
    capacityLimit: number;
    entityName: string;
    id: number;
    perDayLoadLimit: number;
    perDayTfrOutwardLimit: number;
    perDayTrfInwardLimit: number;
    perDayUnLoadLimit: number;
    txnLTfrInwardCount: number;
    txnLoadCount: number;
    txnTrfOutwardCount: number;
    txnUnloadCount: number;
    type: string;
    isChecked: boolean;
  }