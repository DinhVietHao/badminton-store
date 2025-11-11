import { useEffect, useRef, useState } from "react";
import {
  Button,
  Col,
  Container,
  Image,
  Row,
  Spinner,
  Table,
} from "react-bootstrap";
import CheckoutForm from "../../components/layouts-user/CheckoutForm";
import DeleteConfirmModal from "../../components/layouts-user/DeleteConfirmModal";
import {
  deleteCartItem,
  getCartItems,
  updateCartItemQuantity,
} from "../../service/cartApi";
import toast from "react-hot-toast";
import { getProductById } from "../../service/productApi";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import {
  removeItem,
  setCartItems,
  setLoading,
  updateItemQuantity,
} from "../../redux/slices/cartSlice";

import { APP_CONFIG } from "../../config";

const CartPage = () => {
  const dispatch = useDispatch();
  const {
    items: cartItems,
    loading,
    total,
  } = useSelector((state) => state.cart);

  const [showCheckout, setShowCheckout] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const hasShownToast = useRef(false);
  const navigate = useNavigate();
  const userId = JSON.parse(localStorage.getItem("user"))?.id;

  useEffect(() => {
    if (!userId && !hasShownToast.current) {
      toast.error("Vui lòng đăng nhập để xem giỏ hàng!");
      hasShownToast.current = true;
      navigate("/login");
      return;
    }
    const fetchCart = async () => {
      dispatch(setLoading(true));
      try {
        const data = await getCartItems(userId);
        const sorted = data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        dispatch(setCartItems(sorted));
      } catch (err) {
        toast.error("Lỗi load giỏ hàng!");
        console.error("Chi tiết lỗi load giỏ hàng:", err);
      } finally {
        dispatch(setLoading(false));
      }
    };
    fetchCart();
  }, [userId, navigate, dispatch]);

  const handleUpdateQuantity = async (id, delta) => {
    const item = cartItems.find((i) => i.id === id);
    if (!item) return;

    const newQuantity = Math.max(item.quantity + delta, 1);
    try {
      const product = await getProductById(item.productId);
      if (newQuantity > product.quantity) {
        toast.error(`Sản phẩm ${product.title} không đủ số lượng trong kho`);
        return;
      }
      await updateCartItemQuantity(id, newQuantity);
      dispatch(updateItemQuantity({ id, newQuantity }));
    } catch (err) {
      console.error(err);
      toast.error("Không thể cập nhật số lượng sản phẩm. Vui lòng thử lại!");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteCartItem(id);
      dispatch(removeItem(id));
      setShowDeleteModal(false);
    } catch (err) {
      toast.error("Không thể xóa sản phẩm. Vui lòng thử lại!");
    }
  };
  const shippingFee = APP_CONFIG.SHIPPING_FEE;
  const grandTotal = total + shippingFee;

  if (loading) {
    return (
      <Container className="mt-5 text-center">
        <Spinner animation="border" /> <p>Đang tải dữ liệu...</p>
      </Container>
    );
  }
  return (
    <>
      {cartItems.length === 0 ? (
        <div className="text-center">
          <Image src="/images/cartEmpty.png" className="me-3" />
          <p className="text-muted">
            Không có sản phẩm nào trong giỏ hàng của bạn
          </p>
        </div>
      ) : (
        <Container className="my-5">
          <h3 className="mb-4">
            <i className="bi bi-cart3 me-2"></i>
            giỏ hàng của bạn
          </h3>
          <Row>
            <Col md={9}>
              <Table hover responsive className="align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Sản phẩm</th>
                    <th className="text-center">Đơn giá</th>
                    <th className="text-center">Số lượng</th>
                    <th className="text-center">Thành tiền</th>
                    <th className="text-center">Xóa</th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <div className="d-flex align-items-center">
                          <Image
                            src={item.thumbnailUrl}
                            rounded
                            style={{
                              width: "120px",
                              height: "120px",
                              objectFit: "cover",
                            }}
                            className="me-3"
                          />
                          <div>
                            <h6 className="mb-1">{item.title}</h6>
                          </div>
                        </div>
                      </td>
                      <td className="text-center">
                        {item.originalPrice &&
                        item.originalPrice > item.salePrice ? (
                          <>
                            <div className="order-item-old-price">
                              {item.originalPrice.toLocaleString("vi-VN")} ₫
                            </div>
                            <div className="order-item-new-price">
                              {item.salePrice.toLocaleString("vi-VN")} ₫
                            </div>
                          </>
                        ) : (
                          <div className="order-item-new-price">
                            {item.salePrice.toLocaleString("vi-VN")} ₫
                          </div>
                        )}
                      </td>
                      <td className="text-center">
                        <div className="d-flex justify-content-center align-items-center">
                          <Button
                            variant="outline-secondary"
                            size="sm"
                            onClick={() => handleUpdateQuantity(item.id, -1)}
                          >
                            -
                          </Button>
                          <span className="mx-2">{item.quantity}</span>
                          <Button
                            variant="outline-secondary"
                            size="sm"
                            onClick={() => handleUpdateQuantity(item.id, 1)}
                          >
                            +
                          </Button>
                        </div>
                      </td>
                      <td className="text-center">
                        {(item.salePrice * item.quantity).toLocaleString(
                          "vi-VN"
                        )}
                        đ
                      </td>
                      <td className="text-center">
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => {
                            setItemToDelete(item);
                            setShowDeleteModal(true);
                          }}
                        >
                          <i className="bi bi-trash"></i>
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              {cartItems.length === 0 && (
                <div className="text-center py-5 text-muted">
                  <i className="bi bi-cart-x fs-1"></i>
                  <p className="mt-3">Giỏ hàng trống</p>
                </div>
              )}
            </Col>

            <Col md={3}>
              <div className="border p-3 rounded shadow-sm">
                <h5 className="mb-3">Tổng Thanh Toán</h5>
                <div className="d-flex justify-content-between mb-2">
                  <span>Tạm tính</span>
                  <strong>{total.toLocaleString("vi-VN")}đ</strong>
                </div>
                <div className="d-flex justify-content-between mb-3">
                  <span>Phí vận chuyển</span>
                  <strong>30.000đ</strong>
                </div>
                <hr />
                <div className="d-flex justify-content-between mb-3">
                  <span>Tổng cộng</span>
                  <strong>{grandTotal.toLocaleString("vi-VN")}đ</strong>
                </div>
                <Button
                  variant="success"
                  className="w-100"
                  disabled={cartItems.length === 0}
                  onClick={() => setShowCheckout(true)}
                >
                  <i className="bi bi-bag-check-fill me-2" />
                  Đặt hàng
                </Button>
              </div>
            </Col>
          </Row>
          {showCheckout && (
            <CheckoutForm
              grandTotal={grandTotal}
              cartItems={cartItems}
              show={showCheckout}
              onHide={() => setShowCheckout(false)}
            />
          )}

          <DeleteConfirmModal
            show={showDeleteModal}
            onHide={() => setShowDeleteModal(false)}
            onConfirm={() => {
              if (itemToDelete) {
                handleDelete(itemToDelete.id);
              }
            }}
          />
        </Container>
      )}
    </>
  );
};

export default CartPage;
