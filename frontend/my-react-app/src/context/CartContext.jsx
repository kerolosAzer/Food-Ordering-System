import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const savedCart = localStorage.getItem("cartItems");
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (error) {
      console.error("Failed to load cart from localStorage:", error);
      return [];
    }
  });

  const [cartMessage, setCartMessage] = useState("");
  const [cartMessageType, setCartMessageType] = useState("error");

  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (item, restaurantId) => {
    setCartMessage("");

    const itemRestaurantId = Number(restaurantId);

    if (!itemRestaurantId) {
      setCartMessageType("error");
      setCartMessage("Restaurant ID is missing. Please try again.");
      return false;
    }

    let addedSuccessfully = true;

    setCartItems((prevItems) => {
      if (prevItems.length > 0) {
        const currentCartRestaurantId = Number(prevItems[0].restaurantId);

        if (currentCartRestaurantId !== itemRestaurantId) {
          setCartMessageType("error");
          setCartMessage(
            "You can only order from one restaurant at a time. Please clear your cart first."
          );

          addedSuccessfully = false;
          return prevItems;
        }
      }

      const existingItem = prevItems.find(
        (cartItem) => Number(cartItem.id) === Number(item.id)
      );

      if (existingItem) {
        setCartMessageType("success");
        setCartMessage("Item quantity increased in cart.");

        return prevItems.map((cartItem) =>
          Number(cartItem.id) === Number(item.id)
            ? {
                ...cartItem,
                quantity: Number(cartItem.quantity) + 1,
              }
            : cartItem
        );
      }

      setCartMessageType("success");
      setCartMessage("Item added to cart successfully.");

      return [
        ...prevItems,
        {
          ...item,
          quantity: 1,
          restaurantId: itemRestaurantId,
        },
      ];
    });

    return addedSuccessfully;
  };

  const removeFromCart = (itemId) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => Number(item.id) !== Number(itemId))
    );

    setCartMessageType("success");
    setCartMessage("Item removed from cart.");
  };

  const increaseQuantity = (itemId) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        Number(item.id) === Number(itemId)
          ? {
              ...item,
              quantity: Number(item.quantity) + 1,
            }
          : item
      )
    );
  };

  const decreaseQuantity = (itemId) => {
    setCartItems((prevItems) =>
      prevItems
        .map((item) =>
          Number(item.id) === Number(itemId)
            ? {
                ...item,
                quantity: Number(item.quantity) - 1,
              }
            : item
        )
        .filter((item) => Number(item.quantity) > 0)
    );
  };

  const clearCart = () => {
    setCartItems([]);
    setCartMessage("");
    localStorage.removeItem("cartItems");
  };

  const clearCartMessage = () => {
    setCartMessage("");
  };

  const totalPrice = cartItems.reduce(
    (total, item) =>
      total + Number(item.price || 0) * Number(item.quantity || 0),
    0
  );

  const cartRestaurantId =
    cartItems.length > 0 ? Number(cartItems[0].restaurantId) : null;

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartMessage,
        cartMessageType,
        cartRestaurantId,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        clearCart,
        clearCartMessage,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}