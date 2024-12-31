export interface TransactionData {
    payerVPA: string;
    payerName: string;
    payeeVPA: string;
    payeeName: string;
    date: string;
    amount: string;
    type: string;
    status: string;
    custRefNo: string;
    tokenUsed?: string;
  }