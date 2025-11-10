// service/productApi.js
const API_URL = "http://localhost:5000";

export const getProductById = async (id) => {
  const res = await fetch(`${API_URL}/products/${id}`);
  if (!res.ok) throw new Error("Không lấy được sản phẩm");
  return await res.json();
};

export const updateProductStock = async (id, quantity, soldCount) => {
  const res = await fetch(`${API_URL}/products/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      quantity,
      soldCount,
      updatedAt: new Date().toISOString(),
    }),
  });
  if (!res.ok) throw new Error("Cập nhật sản phẩm thất bại");
};
