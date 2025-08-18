export type IApartmentSortName = "meters" | "floor" | "price";
export type IApartmentSortOrder = "ASC" | "DESC";

export interface IApartment {
  id: number;
  url: string;
  title: string;
  room: number;
  meters: number;
  floor: number;
  floors: number;
  price: number;
}

export interface IApartmentMap {
  id: number;
  url: string;
  title: string;
  meters: string;
  floor: number;
  floors: number;
  price: string;
}

export interface IApartmentFilter {
  room: number;
  price: number[];
  meters: number[];
}

export interface IApartmentSortOption {
  name: IApartmentSortName;
  isSort: boolean;
  order: IApartmentSortOrder;
}
