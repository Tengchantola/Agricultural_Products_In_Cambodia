import { MarketPrice } from "../types/market";

const API_BASE_URL = "http://127.0.0.1:8000/api";

export interface PriceFormData {
  Price: number;
  PriceDate: string;
  Product: number;
  Market: number;
}

export async function getMarketPrices(): Promise<MarketPrice[]> {
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

export async function createPrice(
  priceData: PriceFormData
): Promise<MarketPrice> {
  try {
    const response = await fetch(`${API_BASE_URL}/prices/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(priceData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error creating price:", error);
    throw new Error("Failed to create price");
  }
}

export async function updatePrice(
  priceId: number,
  priceData: PriceFormData
): Promise<MarketPrice> {
  try {
    console.log(`==> ${priceId}`);
    const response = await fetch(`${API_BASE_URL}/prices/${priceId}/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(priceData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error updating price:", error);
    throw new Error("Failed to update price");
  }
}

export async function deletePrice(priceId: number): Promise<void> {
  try {
    console.log(priceId);
    const response = await fetch(`${API_BASE_URL}/prices/${priceId}/`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.error("Error deleting price:", error);
    throw new Error("Failed to delete price");
  }
}
