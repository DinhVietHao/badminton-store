const BASE_URL = "http://localhost:5000";

export const getOrdersByUserId = async (userId) => {
  const res = await fetch(`${BASE_URL}/orders?userId=${userId}`);
  if (!res.ok) throw new Error("Không thể tải danh sách đơn hàng");
  return await res.json();
};

export const getOrders = async () => {
  const res = await fetch(`${BASE_URL}/orders`);
  if (!res.ok) throw new Error("Không thể tải danh sách đơn hàng");
  return await res.json();
};

export const getOrderById = async (orderId) => {
  const res = await fetch(`${BASE_URL}/orders/${orderId}`);
  if (!res.ok) throw new Error("Không thể tải thông tin đơn hàng");
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

export const updateOrderStatus = async (orderId, newStatus) => {
  const res = await fetch(`${BASE_URL}/orders/${orderId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status: newStatus }),
  });
  if (!res.ok) throw new Error("Không thể cập nhật trạng thái đơn hàng");
  return await res.json();
};
