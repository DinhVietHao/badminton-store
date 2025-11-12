🏸 Badminton Store - E-commerce Platform
Hệ thống quản lý và bán hàng trực tuyến chuyên về vợt cầu lông và phụ kiện thể thao

\*Source code: https://github.com/DinhVietHao/badminton-store.git

🎯 Giới Thiệu
Badminton Store là một ứng dụng web e-commerce chuyên nghiệp được xây dựng bằng React và Redux Toolkit, cung cấp nền tảng mua sắm trực tuyến cho các sản phẩm vợt cầu lông và phụ kiện thể thao.

✨ Điểm Nổi Bật

- Single Page Application (SPA) với React Router v6
- State Management hiện đại với Redux Toolkit
- Responsive Design với React Bootstrap
- Authentication & Authorization đầy đủ
- Admin Dashboard với biểu đồ thống kê
- Shopping Cart với real-time updates
- Advanced Product Filtering và tìm kiếm
- Tính Năng
- Người Dùng (Customer)

🏠 Trang Chính

- Banner slider với sản phẩm nổi bật
- Hiển thị sản phẩm mới nhất
- Danh sách sản phẩm bán chạy
- Thông tin dịch vụ (vận chuyển, bảo hành...)

🛍️ Mua Sắm

- Danh sách sản phẩm với pagination
- Bộ lọc nâng cao:
  - Theo giá
  - Theo thương hiệu (Yonex, Lining, Victor, VNB...)
  - Theo trình độ người chơi
  - Theo phong cách chơi
  - Theo trạng thái (còn hàng/hết hàng)
- Tìm kiếm theo tên, SKU, thương hiệu
- Chi tiết sản phẩm:
  - Gallery ảnh sản phẩm
  - Thông số kỹ thuật đầy đủ
  - Giá gốc và giá khuyến mãi
- Đánh giá và mô tả

🛒 Giỏ Hàng

- Thêm/xóa/cập nhật số lượng sản phẩm
- Tính tổng tiền tự động
- Kiểm tra số lượng tồn kho
- Lưu giỏ hàng theo user

💳 Thanh Toán

- Form thông tin giao hàng
- Xác nhận đơn hàng
- Lịch sử đơn hàng
- Chi tiết từng đơn hàng

👤 Quản Lý Tài Khoản

- Đăng ký/Đăng nhập
- Quên mật khẩu với OTP
- Cập nhật thông tin cá nhân
- Đổi mật khẩu
- Avatar mặc định theo role

👨‍💼 Quản Trị Viên (Admin)

- Thống kê tổng quan:
  - Tổng sản phẩm
  - Tổng đơn hàng
  - Số lượng người dùng
  - Doanh thu
  - Biểu đồ doanh thu theo tháng (Chart.js)
  - Top 5 sản phẩm bán chạy
  - Trạng thái đơn hàng (Progress bars)
  - Tỷ lệ tăng trưởng so với kỳ trước
- Quản Lý Sản Phẩm
  - Thêm sản phẩm mới
  - Sửa thông tin sản phẩm
  - Xóa sản phẩm
  - Xem chi tiết
- Quản lý tồn kho
  - Danh sách đơn hàng với pagination
  - Xem chi tiết đơn hàng
  - Cập nhật trạng thái (chờ xác nhận → đã xác nhận)
- Quản Lý Người Dùng
  - Danh sách người dùng
  - Phân biệt Admin/Customer
  - Thống kê số lượng

🛠️ Công Nghệ Sử Dụng
\*Fontend

- React 18.x - UI Library
- Redux Toolkit - State Management
- React Router v6 - Routing
- React Bootstrap - UI Components
- Bootstrap 5 - CSS Framework
- React Icons - Icon Library
- Axios - HTTP Client
- Chart.js + react-chartjs-2 - Data Visualization
- React Slick - Carousel Component
- React DatePicker - Date Picker
- React Hot Toast - Toast Notifications
- zxcvbn - Password Strength Meter
  \*Backend (API)
- JSON Server - Mock REST API
- Dev Tools
- Redux DevTools - State Debugging

📁 Cấu Trúc Dự Án
badminton-store/
│
├── api/
│ └── db.json # Database JSON Server
│
├── public/
│ ├── images/ # Static images
│ │ ├── banner/ # Homepage banners
│ │ ├── logo/ # Logo
│ │ └── products/ # Product images
│ └── index.html
│
└── src/
├── components/ # Reusable components
│ ├── Header.jsx # Main header
│ ├── Footer.jsx # Main footer
│ ├── layouts-admin/ # Admin components
│ │ ├── AdminSidebar.jsx
│ │ ├── OrderDetailModal.jsx
│ │ └── RevenueChart.jsx
│ └── layouts-user/ # User components
│ ├── CheckoutForm.jsx
│ ├── ProductSidebar.jsx
│ └── DeleteConfirmModal.jsx
│
├── layouts/ # Layout wrappers
│ ├── MainLayout.jsx # User layout
│ └── AdminLayout.jsx # Admin layout
│
├── pages/ # Page components
│ ├── user/ # User pages
│ │ ├── HomePage.jsx
│ │ ├── ProductPage.jsx
│ │ ├── ProductDetail.jsx
│ │ ├── CartPage.jsx
│ │ ├── LoginPage.jsx
│ │ ├── RegisterPage.jsx
│ │ ├── AccountPage.jsx
│ │ ├── EditProfileInfo.jsx
│ │ ├── OrderPage.jsx
│ │ └── OrderDetailPage.jsx
│ │
│ └── admin/ # Admin pages
│ ├── Dashboard.jsx
│ ├── ProductManager.jsx
│ ├── ProductDetail.jsx
│ ├── OrderManager.jsx
