import { MarketPrice } from "../types/market";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function getMarketPrices(): Promise<MarketPrice[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/prices/`);
    if (!response.ok) {
      throw new Error("Failed to fetch market prices");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching market prices:", error);
    throw error;
  }
}
