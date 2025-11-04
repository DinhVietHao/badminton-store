import { Modal, Button } from "react-bootstrap";

const DeleteConfirmModal = ({ show, onHide, onConfirm }) => (
  <Modal show={show} onHide={onHide} centered>
    <Modal.Header closeButton>
      <Modal.Title>Xóa sản phẩm</Modal.Title>
    </Modal.Header>
    <Modal.Body>Bạn có muốn xóa sản phẩm này?</Modal.Body>
    <Modal.Footer>
      <Button variant="secondary" onClick={onHide}>
        Hủy
      </Button>
      <Button variant="danger" onClick={onConfirm}>
        Xóa
      </Button>
    </Modal.Footer>
  </Modal>
);

export default DeleteConfirmModal;
