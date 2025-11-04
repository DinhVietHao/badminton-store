const BASE_URL = "http://localhost:5000";

export const getCartItems = async () => {
  const res = await fetch(`${BASE_URL}/cart`);
  if (!res.ok) throw new Error("Không thể tải giỏ hàng");
  return await res.json();
};

export const updateCartItemQuantity = async (id, quantity) => {
  const res = await fetch(`${BASE_URL}/cart/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ quantity }),
  });
  if (!res.ok) throw new Error("Cập nhật thất bại");
};

export const deleteCartItem = async (id) => {
  const res = await fetch(`${BASE_URL}/cart/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Xóa thất bại");
};
