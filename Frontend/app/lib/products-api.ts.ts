import { Product, ProductFormData } from "../types/product";

const API_BASE_URL = "http://127.0.0.1:8000/api";

export async function getProducts(): Promise<Product[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/products/`, {
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
    console.error("Error fetching products:", error);
    throw new Error("Failed to fetch products");
  }
}

export async function createProduct(
  productData: ProductFormData
): Promise<Product> {
  try {
    const response = await fetch(`${API_BASE_URL}/products/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(productData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error creating product:", error);
    throw new Error("Failed to create product");
  }
}

export async function updateProduct(
  productId: number,
  productData: ProductFormData
): Promise<Product> {
  try {
    const response = await fetch(`${API_BASE_URL}/products/${productId}/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(productData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error updating product:", error);
    throw new Error("Failed to update product");
  }
}

export async function deleteProduct(productId: number): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/products/${productId}/`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.error("Error deleting product:", error);
    throw new Error("Failed to delete product");
  }
}
