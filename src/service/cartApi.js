const BASE_URL = "http://localhost:5000";

export const getCartItems = async (userId) => {
  const res = await fetch(`${BASE_URL}/cart?userId=${userId}`);
  if (!res.ok) throw new Error("Không thể tải giỏ hàng");
  return await res.json();
};

export const updateCartItemQuantity = async (id, quantity) => {
  const res = await fetch(`${BASE_URL}/cart/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ quantity }),
  });
  if (!res.ok) throw new Error("Cập nhật số lượng thất bại");
};

export const addCartItem = async (newItem) => {
  const res = await fetch(`${BASE_URL}/cart`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newItem),
  });
  if (!res.ok) throw new Error("Thêm giỏ hàng thất bại");
};

export const deleteCartItem = async (id) => {
  const res = await fetch(`${BASE_URL}/cart/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Xóa giỏ hàng thất bại");
};
