import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { useTheme } from '../context/ThemeContext';
import { useState } from 'react';
import { useMutation } from 'react-query';
import axios from 'axios';
import { api } from '../api/config';
import { CreateOrderPayload } from '../types/cart';

const createOrder = async (payload: CreateOrderPayload) => {
  const { data } = await axios.post(`${api.baseURL}${api.endpoints.orders}`, payload);
  return data;
};

export default function CartPage() {
  const { items, totalItems, subtotal, removeFromCart, updateQuantity, clearCart } = useCart();
  const { showToast } = useToast();
  const { darkMode } = useTheme();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);

  const orderMutation = useMutation(createOrder, {
    onSuccess: () => {
      showToast('Order placed successfully!', 'success');
      clearCart();
      setIsProcessing(false);
      // Redirect to products page after a short delay
      setTimeout(() => {
        navigate('/products');
      }, 1500);
    },
    onError: (error: unknown) => {
      setIsProcessing(false);
      const message = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to place order. Please try again.';
      showToast(message, 'error');
    },
  });

  const handlePlaceOrder = () => {
    if (items.length === 0) {
      return;
    }

    setIsProcessing(true);
    
    // Use hardcoded branchId as specified in requirements
    const payload: CreateOrderPayload = {
      branchId: 1,
      items: items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      })),
    };

    orderMutation.mutate(payload);
  };

  const handleQuantityChange = (productId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  // Empty state
  if (items.length === 0) {
    return (
      <div
        className={`min-h-screen ${darkMode ? 'bg-dark' : 'bg-gray-100'} pt-20 pb-16 px-4 transition-colors duration-300`}
      >
        <div className="max-w-7xl mx-auto">
          <div
            className={`flex flex-col items-center justify-center text-center py-20 rounded-lg ${
              darkMode ? 'bg-gray-800' : 'bg-white'
            } shadow-sm`}
          >
            <svg
              className={`w-24 h-24 mb-4 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
            </svg>
            <h2 className={`text-2xl font-bold ${darkMode ? 'text-light' : 'text-gray-800'} mb-2`}>
              Your cart is empty
            </h2>
            <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-6`}>
              Add some products to get started!
            </p>
            <Link
              to="/products"
              className="bg-primary hover:bg-accent text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Browse Products
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen ${darkMode ? 'bg-dark' : 'bg-gray-100'} pt-20 pb-16 px-4 transition-colors duration-300`}
    >
      <div className="max-w-7xl mx-auto">
        <h1 className={`text-3xl font-bold ${darkMode ? 'text-light' : 'text-gray-800'} mb-6`}>
          Shopping Cart
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div
                key={item.productId}
                className={`${
                  darkMode ? 'bg-gray-800' : 'bg-white'
                } rounded-lg shadow-md p-4 transition-colors duration-300`}
              >
                <div className="flex flex-col sm:flex-row gap-4">
                  {/* Product Image */}
                  <div
                    className={`w-full sm:w-32 h-32 ${
                      darkMode ? 'bg-gray-700' : 'bg-gray-100'
                    } rounded-lg flex items-center justify-center flex-shrink-0`}
                  >
                    {item.imgName ? (
                      <img
                        src={`/${item.imgName}`}
                        alt={item.name}
                        className="w-full h-full object-contain p-2"
                      />
                    ) : (
                      <svg
                        className={`w-16 h-16 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`}
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                      </svg>
                    )}
                  </div>

                  {/* Product Details */}
                  <div className="flex-grow">
                    <h3 className={`text-lg font-semibold ${darkMode ? 'text-light' : 'text-gray-800'} mb-2`}>
                      {item.name}
                    </h3>
                    <p className={`text-primary text-xl font-bold mb-4`}>
                      ${item.price.toFixed(2)}
                    </p>

                    <div className="flex flex-wrap items-center gap-4">
                      {/* Quantity Controls */}
                      <div
                        className={`flex items-center space-x-3 ${
                          darkMode ? 'bg-gray-700' : 'bg-gray-200'
                        } rounded-lg p-1`}
                      >
                        <button
                          onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                          className={`w-8 h-8 flex items-center justify-center ${
                            darkMode ? 'text-light' : 'text-gray-700'
                          } hover:text-primary transition-colors`}
                          aria-label={`Decrease quantity of ${item.name}`}
                        >
                          -
                        </button>
                        <span
                          className={`${darkMode ? 'text-light' : 'text-gray-800'} min-w-[2rem] text-center font-medium`}
                        >
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                          className={`w-8 h-8 flex items-center justify-center ${
                            darkMode ? 'text-light' : 'text-gray-700'
                          } hover:text-primary transition-colors`}
                          aria-label={`Increase quantity of ${item.name}`}
                        >
                          +
                        </button>
                      </div>

                      {/* Line Total */}
                      <div className={`${darkMode ? 'text-light' : 'text-gray-800'} font-semibold`}>
                        Total: ${(item.price * item.quantity).toFixed(2)}
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => removeFromCart(item.productId)}
                        className="ml-auto text-red-500 hover:text-red-700 transition-colors"
                        aria-label={`Remove ${item.name} from cart`}
                      >
                        <svg
                          className="w-6 h-6"
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Cart Summary */}
          <div className="lg:col-span-1">
            <div
              className={`${
                darkMode ? 'bg-gray-800' : 'bg-white'
              } rounded-lg shadow-md p-6 sticky top-24 transition-colors duration-300`}
            >
              <h2 className={`text-xl font-bold ${darkMode ? 'text-light' : 'text-gray-800'} mb-4`}>
                Order Summary
              </h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                    Items ({totalItems})
                  </span>
                  <span className={darkMode ? 'text-light' : 'text-gray-800'}>
                    ${subtotal.toFixed(2)}
                  </span>
                </div>
                <div className={`border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'} pt-3`}>
                  <div className="flex justify-between text-lg font-bold">
                    <span className={darkMode ? 'text-light' : 'text-gray-800'}>Subtotal</span>
                    <span className="text-primary">${subtotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={handlePlaceOrder}
                  disabled={isProcessing || orderMutation.isLoading}
                  className={`w-full py-3 rounded-lg font-medium transition-colors ${
                    isProcessing || orderMutation.isLoading
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-primary hover:bg-accent text-white'
                  }`}
                >
                  {isProcessing || orderMutation.isLoading ? (
                    <span className="flex items-center justify-center">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    'Place Order'
                  )}
                </button>

                <Link
                  to="/products"
                  className={`block w-full py-3 rounded-lg font-medium text-center transition-colors ${
                    darkMode
                      ? 'bg-gray-700 text-light hover:bg-gray-600'
                      : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                  }`}
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
