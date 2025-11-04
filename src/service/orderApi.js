const BASE_URL = "http://localhost:5000";

export const getOrders = async (userId) => {
  const res = await fetch(`${BASE_URL}/orders?userId=${userId}`);
  if (!res.ok) throw new Error("Không thể tải danh sách đơn hàng");
  return await res.json();
};

export const createOrder = async (order) => {
  const res = await fetch(`${BASE_URL}/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(order),
  });
  if (!res.ok) throw new Error("Tạo đơn hàng thất bại");
  return await res.json();
};
