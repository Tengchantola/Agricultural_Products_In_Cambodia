export interface PriceTrend {
  date: string;
  averagePrice: number;
  productCount: number;
}

export interface MarketStats {
  marketName: string;
  productCount: number;
  averagePrice: number;
  priceChange: number;
}

export interface ProductStats {
  productName: string;
  marketCount: number;
  averagePrice: number;
  minPrice: number;
  maxPrice: number;
}

export interface CategoryStats {
  category: string;
  productCount: number;
  marketCount: number;
  averagePrice: number;
}

export interface ReportFilters {
  startDate: string;
  endDate: string;
  market: string;
  product: string;
  category: string;
}
