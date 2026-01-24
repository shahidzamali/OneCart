import React, { createContext, useContext, useEffect, useState } from "react";
import { authDataContext } from "./AuthContext";
import { userDataContext } from "./UserContext";
import { toast } from "react-toastify";
import api from "../utils/api.js";

export const shopDataContext = createContext();

function ShopContext({ children }) {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [cartItem, setCartItem] = useState({});
  const [loading, setLoading] = useState(false);

  const { userData } = useContext(userDataContext);

  const currency = "₹";
  const delivery_fee = 40;

  // ✅ PRODUCTS
  const getProducts = async () => {
    try {
      const result = await api.get("/api/product/list");
      setProducts(result.data);
    } catch (error) {
      console.log(error);
    }
  };

  // ✅ ADD TO CART
  const addtoCart = async (itemId, size) => {
    if (!size) {
      toast.error("Select Product Size");
      return;
    }

    let cartData = structuredClone(cartItem);

    if (cartData[itemId]) {
      cartData[itemId][size] = (cartData[itemId][size] || 0) + 1;
    } else {
      cartData[itemId] = {};
      cartData[itemId][size] = 1;
    }

    setCartItem(cartData);

    if (userData) {
      setLoading(true);
      try {
        await api.post(
          "/api/cart/add",
          { itemId, size },
          { withCredentials: true }
        );
        toast.success("Product Added");
      } catch (error) {
        console.log(error);
        toast.error("Add Cart Error");
      } finally {
        setLoading(false);
      }
    }
  };

  // ✅ GET USER CART
  const getUserCart = async () => {
    try {
      const result = await api.post(
        "/api/cart/get",
        {},
        { withCredentials: true }
      );
      setCartItem(result.data);
    } catch (error) {
      console.log(error);
    }
  };

  // ✅ UPDATE CART
  const updateQuantity = async (itemId, size, quantity) => {
    let cartData = structuredClone(cartItem);
    cartData[itemId][size] = quantity;
    setCartItem(cartData);

    if (userData) {
      try {
        await api.post(
          "/api/cart/update",
          { itemId, size, quantity },
          { withCredentials: true }
        );
      } catch (error) {
        console.log(error);
      }
    }
  };

  // ✅ COUNTS
  const getCartCount = () => {
    let totalCount = 0;
    for (const items in cartItem) {
      for (const item in cartItem[items]) {
        if (cartItem[items][item] > 0) {
          totalCount += cartItem[items][item];
        }
      }
    }
    return totalCount;
  };

  const getCartAmount = () => {
    let totalAmount = 0;
    for (const items in cartItem) {
      let itemInfo = products.find((p) => p._id === items);
      for (const item in cartItem[items]) {
        if (cartItem[items][item] > 0 && itemInfo) {
          totalAmount += itemInfo.price * cartItem[items][item];
        }
      }
    }
    return totalAmount;
  };

  useEffect(() => {
    getProducts();
    getUserCart();
  }, []);

  const value = {
    products,
    currency,
    delivery_fee,
    getProducts,
    search,
    setSearch,
    showSearch,
    setShowSearch,
    cartItem,
    addtoCart,
    getCartCount,
    setCartItem,
    updateQuantity,
    getCartAmount,
    loading,
  };

  return (
    <shopDataContext.Provider value={value}>
      {children}
    </shopDataContext.Provider>
  );
}

export default ShopContext;
