export interface Invoice {
  id: string;
  invoice_id: string;
  vendor: string;
  amount: number;
  due_date: string;
  status: 'Paid' | 'Unpaid';
  created_at: string;
}
