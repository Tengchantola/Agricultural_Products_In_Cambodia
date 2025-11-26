import { MarketFormData, Markets } from "../types/market";

const API_BASE_URL = "http://127.0.0.1:8000/api";

export async function getMarkets(): Promise<Markets[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/markets/`, {
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
    console.error("Error fetching markets:", error);
    throw new Error("Failed to fetch markets");
  }
}

export async function createMarket(
  marketData: MarketFormData
): Promise<Markets> {
  try {
    const response = await fetch(`${API_BASE_URL}/markets/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(marketData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error creating market:", error);
    throw new Error("Failed to create market");
  }
}

export async function updateMarket(
  marketId: number,
  marketData: MarketFormData
): Promise<Markets> {
  try {
    const response = await fetch(`${API_BASE_URL}/markets/${marketId}/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(marketData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error updating market:", error);
    throw new Error("Failed to update market");
  }
}

export async function deleteMarket(marketId: number): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/markets/${marketId}/`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.error("Error deleting market:", error);
    throw new Error("Failed to delete market");
  }
}
