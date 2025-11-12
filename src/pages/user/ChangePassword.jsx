// src/pages/profile/ChangePassword.js
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Form, Button, Spinner, Alert, Card } from "react-bootstrap";
import axios from "axios";
import { updateUser, selectUser } from "../../redux/slices/authSlice";

const ChangePassword = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();

    const user = useSelector(selectUser);
    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });
    const [pwLoading, setPwLoading] = useState(false);
    const [pwMessage, setPwMessage] = useState(null);

    if (!user || String(user.id) !== id) {
        navigate(`/profile/${user?.id}`);
        return null;
    }

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordData((prev) => ({ ...prev, [name]: value }));
    };

    const handlePasswordSave = async () => {
        setPwLoading(true);
        setPwMessage(null);

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setPwMessage({ type: "danger", text: "Mật khẩu xác nhận không khớp!" });
            setPwLoading(false);
            return;
        }

        try {
            if (user.password !== passwordData.currentPassword) {
                throw new Error("Mật khẩu hiện tại không đúng.");
            }

            const updatedUserData = { ...user, password: passwordData.newPassword };

            const response = await axios.put(
                `http://localhost:5000/users/${user.id}`,
                updatedUserData
            );

            localStorage.setItem("user", JSON.stringify(response.data));
            dispatch(updateUser(response.data));

            setPwMessage({ type: "success", text: "Đổi mật khẩu thành công!" });
            setPasswordData({
                currentPassword: "",
                newPassword: "",
                confirmPassword: "",
            });
        } catch (err) {
            setPwMessage({
                type: "danger",
                text:
                    err.message ||
                    "Đổi mật khẩu thất bại. Kiểm tra lại mật khẩu hiện tại!",
            });
        } finally {
            setPwLoading(false);
        }
    };

    return (
        <Container className="py-4" style={{ maxWidth: "700px" }}>
            <Card className="p-4 shadow-sm">
                <Button
                    variant="secondary"
                    className="mb-3 px-4 fw-bold"
                    style={{
                        width: "fit-content",
                        alignSelf: "flex-start",
                        backgroundColor: "#449D44",
                        border: "none",
                    }}
                    onClick={() => navigate(`/profile/${id}`)}
                >
                    ← Quay lại
                </Button>

                <h4 className="fw-bold text-uppercase mb-4 text-success">
                    Đổi mật khẩu
                </h4>

                {pwMessage && <Alert variant={pwMessage.type}>{pwMessage.text}</Alert>}

                <Form>
                    <Form.Group className="mb-3">
                        <Form.Label>Mật khẩu hiện tại</Form.Label>
                        <Form.Control
                            type="password"
                            name="currentPassword"
                            value={passwordData.currentPassword}
                            onChange={handlePasswordChange}
                            placeholder="Nhập mật khẩu hiện tại"
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Mật khẩu mới</Form.Label>
                        <Form.Control
                            type="password"
                            name="newPassword"
                            value={passwordData.newPassword}
                            onChange={handlePasswordChange}
                            placeholder="Nhập mật khẩu mới"
                        />
                    </Form.Group>

                    <Form.Group className="mb-4">
                        <Form.Label>Xác nhận mật khẩu mới</Form.Label>
                        <Form.Control
                            type="password"
                            name="confirmPassword"
                            value={passwordData.confirmPassword}
                            onChange={handlePasswordChange}
                            placeholder="Nhập lại mật khẩu mới"
                        />
                    </Form.Group>

                    <div className="text-center">
                        <Button
                            variant="success"
                            style={{
                                minWidth: "200px",
                                backgroundColor: "#449D44",
                                border: "none",
                            }}
                            onClick={handlePasswordSave}
                            disabled={pwLoading}
                        >
                            {pwLoading ? (
                                <>
                                    <Spinner
                                        as="span"
                                        animation="border"
                                        size="sm"
                                        className="me-2"
                                    />
                                    Đang cập nhật...
                                </>
                            ) : (
                                "Cập nhật mật khẩu"
                            )}
                        </Button>
                    </div>
                </Form>
            </Card>
        </Container>
    );
};

export default ChangePassword;
