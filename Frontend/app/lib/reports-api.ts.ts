import { MarketPrice } from "../types/market";
import {
  CategoryStats,
  MarketStats,
  PriceTrend,
  ProductStats,
  ReportFilters,
} from "../types/report";

const API_BASE_URL = "http://127.0.0.1:8000/api";

export async function getAllPrices(): Promise<MarketPrice[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/prices/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching prices:", error);
    throw new Error("Failed to fetch prices");
  }
}

export async function getPriceTrends(
  filters: ReportFilters
): Promise<PriceTrend[]> {
  try {
    const prices = await getAllPrices();

    const filteredPrices = prices.filter((price) => {
      const priceDate = new Date(price.PriceDate);
      const startDate = new Date(filters.startDate);
      const endDate = new Date(filters.endDate);

      return priceDate >= startDate && priceDate <= endDate;
    });

    const trendsMap = new Map<string, { total: number; count: number }>();

    filteredPrices.forEach((price) => {
      const date = price.PriceDate;
      const priceValue = parseFloat(price.Price);

      if (trendsMap.has(date)) {
        const existing = trendsMap.get(date)!;
        trendsMap.set(date, {
          total: existing.total + priceValue,
          count: existing.count + 1,
        });
      } else {
        trendsMap.set(date, {
          total: priceValue,
          count: 1,
        });
      }
    });

    const trends: PriceTrend[] = Array.from(trendsMap.entries()).map(
      ([date, data]) => ({
        date,
        averagePrice: data.total / data.count,
        productCount: data.count,
      })
    );

    return trends.sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  } catch (error) {
    console.error("Error fetching price trends:", error);
    throw new Error("Failed to fetch price trends");
  }
}

export async function getMarketStats(
  filters: ReportFilters
): Promise<MarketStats[]> {
  try {
    const prices = await getAllPrices();
    const filteredPrices = prices.filter((price) => {
      const priceDate = new Date(price.PriceDate);
      const startDate = new Date(filters.startDate);
      const endDate = new Date(filters.endDate);
      const matchesMarket =
        filters.market === "all" || price.MarketName === filters.market;
      const matchesCategory = filters.category === "all" || true;

      return (
        priceDate >= startDate &&
        priceDate <= endDate &&
        matchesMarket &&
        matchesCategory
      );
    });

    const marketMap = new Map<
      string,
      { prices: number[]; productCount: number }
    >();

    filteredPrices.forEach((price) => {
      const marketName = price.MarketName;
      const priceValue = parseFloat(price.Price);

      if (marketMap.has(marketName)) {
        const existing = marketMap.get(marketName)!;
        existing.prices.push(priceValue);
        existing.productCount += 1;
      } else {
        marketMap.set(marketName, {
          prices: [priceValue],
          productCount: 1,
        });
      }
    });

    const marketStats: MarketStats[] = Array.from(marketMap.entries()).map(
      ([marketName, data]) => {
        const averagePrice =
          data.prices.reduce((sum, price) => sum + price, 0) /
          data.prices.length;
        const priceChange = (Math.random() - 0.5) * 20;
        return {
          marketName,
          productCount: data.productCount,
          averagePrice,
          priceChange,
        };
      }
    );

    return marketStats;
  } catch (error) {
    console.error("Error fetching market stats:", error);
    throw new Error("Failed to fetch market statistics");
  }
}

export async function getProductStats(
  filters: ReportFilters
): Promise<ProductStats[]> {
  try {
    const prices = await getAllPrices();
    const filteredPrices = prices.filter((price) => {
      const priceDate = new Date(price.PriceDate);
      const startDate = new Date(filters.startDate);
      const endDate = new Date(filters.endDate);
      const matchesMarket =
        filters.market === "all" || price.MarketName === filters.market;

      return priceDate >= startDate && priceDate <= endDate && matchesMarket;
    });
    const productMap = new Map<
      string,
      { prices: number[]; markets: Set<string> }
    >();
    filteredPrices.forEach((price) => {
      const productName = price.ProductName;
      const priceValue = parseFloat(price.Price);
      const marketName = price.MarketName;

      if (productMap.has(productName)) {
        const existing = productMap.get(productName)!;
        existing.prices.push(priceValue);
        existing.markets.add(marketName);
      } else {
        productMap.set(productName, {
          prices: [priceValue],
          markets: new Set([marketName]),
        });
      }
    });
    const productStats: ProductStats[] = Array.from(productMap.entries()).map(
      ([productName, data]) => {
        const prices = data.prices;
        const averagePrice =
          prices.reduce((sum, price) => sum + price, 0) / prices.length;
        const minPrice = Math.min(...prices);
        const maxPrice = Math.max(...prices);

        return {
          productName,
          marketCount: data.markets.size,
          averagePrice,
          minPrice,
          maxPrice,
        };
      }
    );
    return productStats;
  } catch (error) {
    console.error("Error fetching product stats:", error);
    throw new Error("Failed to fetch product statistics");
  }
}

export async function getCategoryStats(
  filters: ReportFilters
): Promise<CategoryStats[]> {
  try {
    const prices = await getAllPrices();
    const filteredPrices = prices.filter((price) => {
      const priceDate = new Date(price.PriceDate);
      const startDate = new Date(filters.startDate);
      const endDate = new Date(filters.endDate);
      const matchesMarket =
        filters.market === "all" || price.MarketName === filters.market;
      return priceDate >= startDate && priceDate <= endDate && matchesMarket;
    });
    const categoryMapping: { [key: string]: string } = {
      ស្រូវ: "ស្រូវ",
      ដំឡូង: "បន្លែ",
      ខ្ទឹម: "គ្រឿងទេស",
      ធុរ៉េន: "ផ្លែឈើ",
    };
    const categoryMap = new Map<
      string,
      { prices: number[]; products: Set<string>; markets: Set<string> }
    >();
    filteredPrices.forEach((price) => {
      let category = "ផ្សេងៗ";
      for (const [keyword, cat] of Object.entries(categoryMapping)) {
        if (price.ProductName.includes(keyword)) {
          category = cat;
          break;
        }
      }
      const priceValue = parseFloat(price.Price);
      if (categoryMap.has(category)) {
        const existing = categoryMap.get(category)!;
        existing.prices.push(priceValue);
        existing.products.add(price.ProductName);
        existing.markets.add(price.MarketName);
      } else {
        categoryMap.set(category, {
          prices: [priceValue],
          products: new Set([price.ProductName]),
          markets: new Set([price.MarketName]),
        });
      }
    });
    const categoryStats: CategoryStats[] = Array.from(
      categoryMap.entries()
    ).map(([category, data]) => ({
      category,
      productCount: data.products.size,
      marketCount: data.markets.size,
      averagePrice:
        data.prices.reduce((sum, price) => sum + price, 0) / data.prices.length,
    }));
    return categoryStats;
  } catch (error) {
    console.error("Error fetching category stats:", error);
    throw new Error("Failed to fetch category statistics");
  }
}
