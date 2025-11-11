import { useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import { getProductById, updateProductStock } from "../../service/productApi";
import { createOrder } from "../../service/orderApi";
import { deleteCartItem } from "../../service/cartApi";

const CheckoutForm = ({
  show,
  onHide,
  grandTotal,
  cartItems,
  setCartItems,
}) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const userId = JSON.parse(localStorage.getItem("user"))?.id;
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
      userId: userId,
      products: cartItems.map((item) => ({
        productId: item.productId,
        title: item.title,
        originalPrice: item.originalPrice,
        salePrice: item.salePrice,
        quantity: item.quantity,
        thumbnailUrl: item.thumbnailUrl,
      })),
      total: grandTotal,
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
      onHide();
      navigate("/orders");
    } catch (err) {
      console.error(err);
      toast.error("Có lỗi khi đặt hàng!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Thông tin nhận hàng</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form noValidate validated={validated} onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
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
          <Form.Group className="mb-3">
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
          <Form.Group className="mb-3">
            <Form.Label>Địa chỉ</Form.Label>
            <Form.Control
              required
              as="textarea"
              rows={2}
              name="address"
              placeholder="Nhập địa chỉ giao hàng"
              value={formData.address}
              onChange={handleChange}
            />
            <Form.Control.Feedback type="invalid">
              Vui lòng nhập địa chỉ.
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Ghi chú</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              name="note"
              placeholder="Ghi chú (nếu có)"
              value={formData.note}
              onChange={handleChange}
            />
          </Form.Group>
          <Button
            variant="success"
            type="submit"
            disabled={loading}
            className="w-100"
          >
            {loading ? (
              <span className="spinner-border spinner-border-sm me-2" />
            ) : (
              <i className="bi bi-bag-check-fill me-2" />
            )}
            Xác nhận
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default CheckoutForm;
