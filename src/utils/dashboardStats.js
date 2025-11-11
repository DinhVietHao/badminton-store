/**
 * Tính tổng doanh thu từ danh sách đơn hàng
 */
export const calculateTotalRevenue = (orders) => {
  return orders.reduce((sum, order) => sum + (order.total || 0), 0);
};

/**
 * Tính doanh thu theo khoảng thời gian
 */
export const calculateRevenueByDateRange = (orders, startDate, endDate) => {
  return orders
    .filter((order) => {
      const orderDate = new Date(order.createdAt);
      return orderDate >= startDate && orderDate <= endDate;
    })
    .reduce((sum, order) => sum + (order.total || 0), 0);
};

/**
 * Nhóm doanh thu theo tháng
 */
export const groupRevenueByMonth = (orders, startDate, endDate) => {
  const monthlyData = {};

  orders.forEach((order) => {
    const orderDate = new Date(order.createdAt);

    if (orderDate >= startDate && orderDate <= endDate) {
      const monthKey = orderDate.toLocaleString("vi-VN", {
        month: "long",
        year: "numeric",
      });

      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = 0;
      }
      monthlyData[monthKey] += order.total || 0;
    }
  });

  const labels = Object.keys(monthlyData);
  const data = Object.values(monthlyData);

  return {
    labels,
    datasets: [
      {
        label: "Doanh thu",
        data: data,
        backgroundColor: "rgba(13, 110, 253, 0.6)",
        borderColor: "rgba(13, 110, 253, 1)",
        borderWidth: 1,
      },
    ],
  };
};

/**
 * Tính số lượng đơn hàng theo trạng thái
 */
export const countOrdersByStatus = (orders) => {
  return {
    pending: orders.filter((o) => o.status === "pending").length,
    shipping: orders.filter((o) => o.status === "shipping").length,
    completed: orders.filter(
      (o) => o.status === "completed" || o.status === "done"
    ).length,
    total: orders.length,
  };
};

/**
 * Lấy top sản phẩm bán chạy
 */
export const getTopSellingProducts = (orders, limit = 5) => {
  const productSales = {};

  orders.forEach((order) => {
    order.products?.forEach((product) => {
      const key = product.productId;
      if (!productSales[key]) {
        productSales[key] = {
          productId: product.productId,
          title: product.title,
          totalQuantity: 0,
          totalRevenue: 0,
        };
      }
      productSales[key].totalQuantity += product.quantity;
      productSales[key].totalRevenue += product.salePrice * product.quantity;
    });
  });

  return Object.values(productSales)
    .sort((a, b) => b.totalQuantity - a.totalQuantity)
    .slice(0, limit);
};

/**
 * Tính tỷ lệ tăng trưởng so với tháng trước
 */
export const calculateGrowthRate = (currentRevenue, previousRevenue) => {
  if (previousRevenue === 0) return 0;
  return ((currentRevenue - previousRevenue) / previousRevenue) * 100;
};
