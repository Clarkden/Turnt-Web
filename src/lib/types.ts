export class Ticket {
  id: number;
  name: string;
  gender: string;
  quantity: number;
  quantityLimit: boolean;
  saleStartDate: string;
  saleEndDate: string;
  saleStartTime: string;
  saleEndTime: string;
  price: number;
  ageLimit: number;

  constructor(
    id: number,
    name: string = "",
    gender: string = "",
    quantity: number = 0,
    quantityLimit: boolean = false,
    saleStartDate: string = "",
    saleEndDate: string = "",
    saleStartTime: string = "",
    saleEndTime: string = "",
    price: number = 0,
    ageLimit: number = 0
  ) {
    this.id = id;
    this.name = name;
    this.gender = gender;
    this.quantity = quantity;
    this.quantityLimit = quantityLimit;
    this.saleStartDate = saleStartDate;
    this.saleEndDate = saleEndDate;
    this.saleStartTime = saleStartTime;
    this.saleEndTime = saleEndTime;
    this.price = price;
    this.ageLimit = ageLimit;
  }

  // getInformation(): object {
  //   return {
  //     id: this.id,
  //     name: this.name,
  //     gender: this.gender,
  //     quantity: this.quantity,
  //     saleStart: this.saleStartDate,
  //     saleEnd: this.saleEndDate,
  //     saleStartTime: this.saleStartTime,
  //     saleEndTime: this.saleEndTime,
  //     price: this.price,
  //   };
  // }
}

export class Party {
  name: string;
  description: string;
  date: string;
  location: string;
  longAndLat: string;
  startTime: string;
  endTime: string;
  paidParty: boolean;
  tickets: Ticket[];
  hostName: string;
  hostAccountID: string;
  createdAt: string;
  flyerPath: string;
  privateAddress: boolean;
  ageLimit: number;
  externalEvent: boolean;
  externalEventLink: string;

  constructor(
    name: string = "",
    description: string = "",
    date: string = "",
    location: string = "",
    latAndLong: string = "",
    startTime: string = "",
    endTime: string = "",
    paidParty: boolean = false,
    tickets: Ticket[] = [],
    hostName: string = "",
    hostAccountID: string = "",
    createdAt: string = "",
    flyerPath: string = "",
    privateAddress: boolean = false,
    ageLimit: number = 0,
    externalEvent: boolean,
    externalEventLink: string
  ) {
    this.name = name;
    this.description = description;
    this.date = date;
    this.location = location;
    this.longAndLat = latAndLong;
    this.startTime = startTime;
    this.endTime = endTime;
    this.paidParty = paidParty;
    this.tickets = tickets;
    this.hostName = hostName;
    this.hostAccountID = hostAccountID;
    this.createdAt = createdAt;
    this.flyerPath = flyerPath;
    this.privateAddress = privateAddress;
    this.ageLimit = ageLimit;
    this.externalEvent = externalEvent;
    this.externalEventLink = externalEventLink;
  }

  // getInformation(): object {
  //   return {
  //     name: this.name,
  //     description: this.description,
  //     date: this.date,
  //     location: this.location,
  //     longAndLat: this.longAndLat,
  //     startTime: this.startTime,
  //     endTime: this.endTime,
  //     paidParty: this.paidParty,
  //     tickets: this.tickets,
  //     hostName: this.hostName,
  //     hostAccountID: this.hostAccountID,
  //     createdAt: this.createdAt,
  //     flyerPath: this.flyerPath,
  //     privateAddress: this.privateAddress,
  //   };
  // }
}
