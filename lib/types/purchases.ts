export interface Transaction {
  id: string;
  vendor: string;
  date: string;
  invoice: string;
  category: string;
  amount: number;
  status: 'Verified' | 'Pending';
  logo?: string;
  icon?: string;
}
