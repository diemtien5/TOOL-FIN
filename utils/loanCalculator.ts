
import { LoanInput, LoanSummary, AmortizationRow } from '../types';

export const calculateLoan = (input: LoanInput): LoanSummary => {
  const { amount, months, interestRate, insuranceRate } = input;
  
  // Insurance fee is calculated on the original Requested Amount (Net Amount)
  const insuranceFee = amount * (insuranceRate / 100);
  
  // The principal used for interest and payment calculation includes the insurance fee (Financed Insurance)
  const totalPrincipal = amount + insuranceFee;

  // Annual rate to monthly rate
  const monthlyRate = (interestRate / 100) / 12;
  
  // Calculate Monthly Payment (PMT)
  // Formula: P * r * (1 + r)^n / ((1 + r)^n - 1)
  // This is the standard formula for Reducing Balance loans (Annuity method)
  const pmt = (totalPrincipal * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
  
  let remainingBalance = totalPrincipal;
  let totalInterest = 0;
  const schedule: AmortizationRow[] = [];

  for (let i = 1; i <= months; i++) {
    const interestPayment = remainingBalance * monthlyRate;
    let principalPayment = pmt - interestPayment;
    
    // Adjust last month to handle rounding errors and ensure balance hits 0
    let currentMonthlyPayment = pmt;
    let currentPrincipal = principalPayment;
    let currentInterest = interestPayment;
    let currentBalance = remainingBalance - principalPayment;

    if (i === months) {
        currentBalance = 0;
        currentPrincipal = remainingBalance;
        currentMonthlyPayment = currentPrincipal + currentInterest;
    }

    remainingBalance = currentBalance;
    totalInterest += currentInterest;

    schedule.push({
      month: i,
      principalPaid: currentPrincipal,
      interestPaid: currentInterest,
      remainingBalance: remainingBalance < 0 ? 0 : remainingBalance,
      monthlyPayment: currentMonthlyPayment
    });
  }

  return {
    monthlyPayment: pmt,
    totalPrincipal: totalPrincipal, // This is the Gross Loan Amount (Amount + Insurance)
    totalInterest: totalInterest,
    totalPayment: totalPrincipal + totalInterest,
    insuranceFee: insuranceFee,
    schedule: schedule
  };
};

export const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
};
