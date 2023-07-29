export interface Ticket {
  id: number;
  name: string;
  gender?: string;
  quantity?: number;
  quantityLimit?: boolean;
  saleStartDate?: string;
  saleEndDate?: string;
  saleStartTime?: string;
  saleEndTime?: string;
  price: number;
  ageLimit?: number;
}

export interface Party {
  id?: string;
  name: string;
  description: string;
  date: string;
  location: string;
  longAndLat?: string;
  startTime: string;
  endTime: string;
  paidParty: boolean;
  tickets?: Ticket[];
  hostName: string;
  hostAccountId?: string;
  createdAt: string;
  flyerPath: string;
  privateAddress?: boolean;
  ageLimit?: number;
  externalEvent?: boolean;
  externalEventLink?: string;
}
