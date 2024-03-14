declare global {
  
  interface Commentary {
    _id: string;
    parentId: string;
    userId: string;
    userName: string;
    date: string;
    message: string;
    children?: Commentary[];
  }

  interface HotelLocation {
    _id: string;
    street: string;
    city: string;
    state: string;
    country: string;
    address: string;
  }

  export interface Hotel {
    _id: string;
    name: string;
    description: string;
    amenities: string[];
    picture: string;
    location: {
      street: string;
      city: string;
      state: string;
      country: string;
      address: string;
    };
    reviews: {
      count: number;
      average: number;
    };
    rooms: {
      doubleSuite: {
        picture: string;
        price: number;
        description: string;
        maxOccupancy: number;
        beds: {
          amount: number;
          size: string;
        };
        roomSize: string;
        totalRooms: number;
        reservedRooms: number;
      };
      juniorSuite: {
        picture: string;
        price: number;
        description: string;
        maxOccupancy: number;
        beds: {
          amount: number;
          size: string;
        };
        roomSize: string;
        totalRooms: number;
        reservedRooms: number;
      };
      standardSuite: {
        picture: string;
        price: number;
        description: string;
        maxOccupancy: number;
        beds: {
          amount: number;
          size: string;
        };
        roomSize: string;
        totalRooms: number;
        reservedRooms: number;
      };
      bigSuite: {
        picture: string;
        price: number;
        description: string;
        maxOccupancy: number;
        beds: {
          amount: number;
          size: string;
        };
        roomSize: string;
        totalRooms: number;
        reservedRooms: number;
      };
    };
    commentaries: Commentary[];
  }

  export interface Reservation {
    _id: string;
    userId: string;
    hotelId: string;
    roomType: string;
    checkIn: Date;
    checkOut: Date;
    guests: number;
    price: number;
  }
}

export {};