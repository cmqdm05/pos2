import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useGetProductsQuery } from '../store/services/productService';
import { useGetCategoriesQuery } from '../store/services/categoryService';
import { useCreateSaleMutation } from '../store/services/saleService';
import { useGetStoreQuery } from '../store/services/storeService';
import ProductGrid from '../components/sales/ProductGrid';
import CategoryFilter from '../components/sales/CategoryFilter';
import CartItem from '../components/sales/CartItem';
import PaymentModal from '../components/sales/PaymentModal';
import Receipt from '../components/sales/Receipt';
import { CartItem as CartItemType } from '../components/sales/types';

const Sales = () => {
  const { storeId } = useParams<{ storeId: string }>();
  const { data: products } = useGetProductsQuery(storeId!);
  const { data: categories } = useGetCategoriesQuery(storeId!);
  const { data: store } = useGetStoreQuery(storeId!);
  const [createSale] = useCreateSaleMutation();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [cart, setCart] = useState<CartItemType[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [lastSaleData, setLastSaleData] = useState<any>(null);

  const filteredProducts = products?.filter((product) => {
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const addToCart = (product: any) => {
    const existingItem = cart.find((item) => item.product._id === product._id);
    if (existingItem) {
      setCart(
        cart.map((item) =>
          item.product._id === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCart([
        ...cart,
        {
          product,
          quantity: 1,
          selectedModifiers: [],
          selectedDiscounts: [],
        },
      ]);
    }
  };

  const removeFromCart = (productId: string) => {
    setCart(cart.filter((item) => item.product._id !== productId));
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart(
      cart.map((item) => {
        if (item.product._id === productId) {
          const newQuantity = item.quantity + delta;
          return newQuantity > 0
            ? { ...item, quantity: newQuantity }
            : item;
        }
        return item;
      })
    );
  };

  const toggleModifier = (itemIndex: number, modifier: any, option: any) => {
    setCart(
      cart.map((item, index) => {
        if (index === itemIndex) {
          const existingModifier = item.selectedModifiers.find(
            (m) => m.name === modifier.name
          );
          if (existingModifier) {
            return {
              ...item,
              selectedModifiers: item.selectedModifiers.map((m) =>
                m.name === modifier.name ? { name: modifier.name, option } : m
              ),
            };
          }
          return {
            ...item,
            selectedModifiers: [...item.selectedModifiers, { name: modifier.name, option }],
          };
        }
        return item;
      })
    );
  };

  const toggleDiscount = (itemIndex: number, discount: any) => {
    setCart(
      cart.map((item, index) => {
        if (index === itemIndex) {
          const hasDiscount = item.selectedDiscounts.some(
            (d) => d.name === discount.name
          );
          return {
            ...item,
            selectedDiscounts: hasDiscount
              ? item.selectedDiscounts.filter((d) => d.name !== discount.name)
              : [...item.selectedDiscounts, discount],
          };
        }
        return item;
      })
    );
  };

  const calculateItemTotal = (item: CartItemType) => {
    let total = item.product.price * item.quantity;
    
    // Add modifier prices
    total += item.selectedModifiers.reduce(
      (sum, modifier) => sum + modifier.option.price * item.quantity,
      0
    );

    // Apply discounts
    item.selectedDiscounts.forEach((discount) => {
      if (discount.type === 'percentage') {
        total *= (1 - discount.value / 100);
      } else {
        total -= discount.value * item.quantity;
      }
    });

    return total;
  };

  const calculateTotal = () => {
    return cart.reduce((sum, item) => sum + calculateItemTotal(item), 0);
  };

  const handlePayment = async (method: 'cash' | 'card' | 'qr', details: any) => {
    try {
      const saleData = {
        store: storeId!,
        items: cart.map((item) => ({
          product: item.product._id,
          quantity: item.quantity,
          modifiers: item.selectedModifiers,
          discounts: item.selectedDiscounts,
          price: item.product.price,
        })),
        total: calculateTotal(),
        paymentMethod: method,
        paymentDetails: details,
      };

      const result = await createSale(saleData).unwrap();
      setShowPaymentModal(false);
      setLastSaleData({
        ...result,
        paymentMethod: method,
        paymentDetails: details,
      });
      setShowReceipt(true);
      toast.success('Payment processed successfully');
    } catch (error) {
      toast.error('Failed to process payment');
    }
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  const handleCloseReceipt = () => {
    setShowReceipt(false);
    setCart([]);
    setLastSaleData(null);
  };

  return (
    <div className="h-[calc(100vh-6rem)] flex gap-6">
      {/* Products Section */}
      <div className="flex-1 flex flex-col">
        <div className="mb-4 space-y-4">
          <input
            type="text"
            placeholder="Search products..."
            className="w-full px-4 py-2 border rounded-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <CategoryFilter
            categories={categories || []}
            selectedCategory={selectedCategory}
            onCategorySelect={setSelectedCategory}
          />
        </div>

        <ProductGrid
          products={filteredProducts || []}
          onProductSelect={addToCart}
        />
      </div>

      {/* Cart Section */}
      <div className="w-96 bg-white rounded-lg shadow-lg flex flex-col">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Current Order
          </h2>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {cart.map((item, index) => (
            <CartItem
              key={item.product._id}
              item={item}
              index={index}
              onRemove={removeFromCart}
              onQuantityChange={updateQuantity}
              onModifierToggle={toggleModifier}
              onDiscountToggle={toggleDiscount}
              calculateItemTotal={calculateItemTotal}
            />
          ))}
        </div>

        <div className="p-4 border-t">
          <div className="flex justify-between items-center mb-4">
            <span className="font-medium">Total:</span>
            <span className="text-xl font-bold">
              ${calculateTotal().toFixed(2)}
            </span>
          </div>
          <button
            onClick={() => setShowPaymentModal(true)}
            disabled={cart.length === 0}
            className="w-full py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Proceed to Payment
          </button>
        </div>
      </div>

      {showPaymentModal && (
        <PaymentModal
          onPayment={handlePayment}
          onClose={() => setShowPaymentModal(false)}
          total={calculateTotal()}
        />
      )}

      {showReceipt && store && lastSaleData && (
        <Receipt
          items={cart}
          total={calculateTotal()}
          paymentMethod={lastSaleData.paymentMethod}
          date={new Date()}
          storeInfo={{
            name: store.name,
            address: store.address,
            phone: store.phone,
          }}
          onClose={handleCloseReceipt}
          onPrint={handlePrintReceipt}
        />
      )}
    </div>
  );
};

export default Sales;