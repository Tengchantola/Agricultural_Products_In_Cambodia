export interface PriceData {
  Price: number;
  PriceDate: string;
}

export interface MarketData {
  totalProducts: number;
  averagePrice: number;
  products: MarketPrice[];
}

export interface MarketPrice {
  PriceID: number;
  ProductName: string;
  MarketName: string;
  Price: string;
  PriceDate: string;
  Product: number;
  Market: number;
}

export interface Product {
  ProductID: number;
  ProductName: string;
  Category: string;
  Unit: string;
  Description?: string;
}

export interface Market {
  MarketID: number;
  MarketName: string;
  Location: string;
  Contact?: string;
  Status: "active" | "inactive";
}

export interface User {
  UserID: number;
  Username: string;
  Email: string;
  Role: "admin" | "editor" | "viewer";
  Status: "active" | "inactive";
  LastLogin?: string;
}

export interface Markets {
  MarketID: number;
  MarketName: string;
  Province: string;
}

export interface MarketFormData {
  MarketName: string;
  Province: string;
}
