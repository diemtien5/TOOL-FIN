
export interface LoanInput {
  amount: number;
  months: number;
  interestRate: number;
  insuranceRate: number;
}

export interface AmortizationRow {
  month: number;
  principalPaid: number;
  interestPaid: number;
  remainingBalance: number;
  monthlyPayment: number;
}

export interface LoanSummary {
  monthlyPayment: number;
  totalPrincipal: number;
  totalInterest: number;
  totalPayment: number;
  insuranceFee: number;
  schedule: AmortizationRow[];
}

export interface ConsultantInfo {
  name: string;
  phone: string;
  zalo: string;
  facebook: string;
  avatar?: string;
  bankId: string; // The ID of the selected bank
  hotline: string; // Allow overriding the default hotline
}
