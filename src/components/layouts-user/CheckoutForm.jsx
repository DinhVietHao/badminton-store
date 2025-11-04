import { useState } from "react";
import { Button, Card, Form } from "react-bootstrap";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import { getProductById, updateProductStock } from "../../service/productApi";
import { createOrder } from "../../service/orderApi";
import { deleteCartItem } from "../../service/cartApi";

const CheckoutForm = ({ total, cartItems, setCartItems, setShowCheckout }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    address: "",
    note: "",
  });

  const [validated, setValidated] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const form = e.currentTarget;
    if (!form.checkValidity()) {
      e.stopPropagation();
      setValidated(true);
      setLoading(false);
      return;
    }

    for (const item of cartItems) {
      const product = await getProductById(item.productId);

      if (!product || product.quantity < item.quantity) {
        toast.error(`Sản phẩm "${item.title}" không đủ hàng!`);
        setLoading(false);
        return;
      }
    }

    const newOrder = {
      userId: 2,
      products: cartItems.map((item) => ({
        productId: item.productId,
        title: item.title,
        originalPrice: item.originalPrice,
        salePrice: item.salePrice,
        quantity: item.quantity,
        thumbnailUrl: item.thumbnailUrl,
      })),
      total,
      status: "pending",
      createdAt: new Date().toISOString(),
      shippingInfo: formData,
    };
    try {
      await createOrder(newOrder);

      for (const item of cartItems) {
        const product = await getProductById(item.productId);

        await updateProductStock(
          item.productId,
          product.quantity - item.quantity,
          (product.soldCount || 0) + item.quantity
        );
      }

      for (const item of cartItems) {
        await deleteCartItem(item.id);
      }

      toast.success("Đặt hàng thành công!");
      setCartItems([]);
      setShowCheckout(false);
      navigate("/orders");
    } catch (err) {
      console.error(err);
      toast.error("Có lỗi khi đặt hàng!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="mt-4 shadow-sm">
      <Card.Header className="bg-success text-white fw-bold">
        <i className="bi bi-truck me-2"></i>Thông Tin Nhận Hàng
      </Card.Header>

      <Card.Body>
        <Form noValidate validated={validated} onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formFullName">
            <Form.Label>Họ và tên</Form.Label>
            <Form.Control
              required
              type="text"
              name="fullName"
              placeholder="Nhập họ tên người nhận"
              value={formData.fullName}
              onChange={handleChange}
            />
            <Form.Control.Feedback type="invalid">
              Vui lòng nhập họ và tên.
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formPhone">
            <Form.Label>Số điện thoại</Form.Label>
            <Form.Control
              required
              type="tel"
              name="phone"
              pattern="^(0[0-9]{9})$"
              placeholder="VD: 0901234567"
              value={formData.phone}
              onChange={handleChange}
            />
            <Form.Control.Feedback type="invalid">
              Số điện thoại không hợp lệ (VD: 0901234567).
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formAddress">
            <Form.Label>Địa chỉ nhận hàng</Form.Label>
            <Form.Control
              required
              as="textarea"
              rows={2}
              name="address"
              placeholder="Nhập địa chỉ giao hàng cụ thể"
              value={formData.address}
              onChange={handleChange}
            />
            <Form.Control.Feedback type="invalid">
              Vui lòng nhập địa chỉ giao hàng.
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formNote">
            <Form.Label>Ghi chú</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              name="note"
              placeholder="Ghi chú cho người giao hàng (nếu có)"
              value={formData.note}
              onChange={handleChange}
            />
          </Form.Group>

          <div className="d-flex justify-content-between align-items-center mt-4">
            <h5 className="fw-bold text-success mb-0">
              Tổng thanh toán: {total.toLocaleString()} đ
            </h5>
            <Button variant="success" type="submit">
              {loading ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                  />
                  Đang xử lý...
                </>
              ) : (
                <>
                  <i className="bi bi-bag-check-fill me-2" /> Xác nhận đặt hàng
                </>
              )}
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default CheckoutForm;
