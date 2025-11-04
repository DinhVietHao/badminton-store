import { useEffect, useState } from "react";
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
} from "../../service/cartService";
import toast from "react-hot-toast";

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCheckout, setShowCheckout] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const data = await getCartItems();
        setCartItems(data);
      } catch (err) {
        console.error("Lỗi load giỏ hàng:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, []);

  const handleQuantityChange = async (id, delta) => {
    const item = cartItems.find((i) => i.id === id);
    if (!item) return;

    const newQuantity = Math.max(item.quantity + delta, 1);
    try {
      await updateCartItemQuantity(id, newQuantity);
      setCartItems((prev) =>
        prev.map((i) => (i.id === id ? { ...i, quantity: newQuantity } : i))
      );
    } catch (err) {
      toast.error("Không thể cập nhật số lượng sản phẩm. Vui lòng thử lại!");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteCartItem(id);
      setCartItems((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      toast.error("Không thể xóa sản phẩm. Vui lòng thử lại!");
    }
  };

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <>
      {loading ? (
        <div className="d-flex justify-content-center align-items-center vh-100">
          <Button variant="primary" disabled>
            <Spinner
              as="span"
              animation="grow"
              size="sm"
              role="status"
              aria-hidden="true"
            />
            Loading...
          </Button>
        </div>
      ) : cartItems.length === 0 ? (
        <div class="text-center">
          <Image src="/images/cartEmpty.png" className="me-3" />
          <p class="text-muted">Không có sản phẩm nào trong giỏ hàng của bạn</p>
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
                        {item.price.toLocaleString("vi-VN")}đ
                      </td>
                      <td className="text-center">
                        <div className="d-flex justify-content-center align-items-center">
                          <Button
                            variant="outline-secondary"
                            size="sm"
                            onClick={() => handleQuantityChange(item.id, -1)}
                          >
                            -
                          </Button>
                          <span className="mx-2">{item.quantity}</span>
                          <Button
                            variant="outline-secondary"
                            size="sm"
                            onClick={() => handleQuantityChange(item.id, 1)}
                          >
                            +
                          </Button>
                        </div>
                      </td>
                      <td className="text-center">
                        {(item.price * item.quantity).toLocaleString("vi-VN")}đ
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
                  <strong>{(total + 30000).toLocaleString("vi-VN")}đ</strong>
                </div>
                <Button
                  variant="success"
                  className="w-100"
                  disabled={cartItems.length === 0}
                  onClick={() => setShowCheckout(true)}
                >
                  <i className="bi bi-bag-check-fill me-2" />
                  Mua Hàng
                </Button>
              </div>
            </Col>
          </Row>
          {showCheckout && (
            <CheckoutForm
              total={total}
              cartItems={cartItems}
              setCartItems={setCartItems}
              setShowCheckout={setShowCheckout}
            />
          )}

          <DeleteConfirmModal
            show={showDeleteModal}
            onHide={() => setShowDeleteModal(false)}
            onConfirm={() => {
              handleDelete(itemToDelete.id);
              setShowDeleteModal(false);
            }}
          />
        </Container>
      )}
    </>
  );
};

export default CartPage;
