import {
  getCartItems,
  addCartItem,
  updateCartItemQuantity,
} from "../service/cartApi";
import { getProductById } from "../service/productApi";
import toast from "react-hot-toast";

export const useAddToCart = () => {
  const addToCart = async (productId) => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const userId = user?.id;

      if (!userId) {
        toast.error("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng!");
        return;
      }

      const product = await getProductById(productId);
      if (!product || product.quantity <= 0) {
        toast.error("Sản phẩm đã hết hàng!");
        return;
      }

      const cartItems = await getCartItems(userId);
      const existingItem = cartItems.find(
        (item) => item.productId === parseInt(product.id)
      );

      if (existingItem) {
        const newQuantity = existingItem.quantity + 1;
        if (newQuantity > product.quantity) {
          toast.error(
            `Sản phẩm "${product.title}" không đủ số lượng để thêm vào giỏ hàng.`
          );
          return;
        }

        await updateCartItemQuantity(existingItem.id, newQuantity);
        toast.success("Tăng số lượng sản phẩm trong giỏ hàng!");
      } else {
        const newItem = {
          userId,
          productId: parseInt(product.id),
          title: product.title,
          originalPrice: product.originalPrice,
          salePrice: product.salePrice,
          quantity: 1,
          thumbnailUrl: product.thumbnailUrl,
          createdAt: new Date().toISOString(),
        };

        await addCartItem(newItem);
        toast.success("Đã thêm sản phẩm vào giỏ hàng!");
      }
    } catch (error) {
      console.error("Lỗi khi thêm vào giỏ hàng:", error);
      toast.error("Không thể thêm vào giỏ hàng!");
    }
  };

  return { addToCart };
};
