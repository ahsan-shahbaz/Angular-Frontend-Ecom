export interface Order {
  id: string;
  userId: number;
  items: any[];
  total: number;
  status: string;
  date: Date;
}
