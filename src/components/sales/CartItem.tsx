import React from 'react';
import { X, Plus, Minus } from 'lucide-react';
import { CartItem as CartItemType } from './types';

interface CartItemProps {
  item: CartItemType;
  index: number;
  onRemove: (productId: string) => void;
  onQuantityChange: (productId: string, delta: number) => void;
  onModifierToggle: (index: number, modifier: any, option: any) => void;
  onDiscountToggle: (index: number, discount: any) => void;
  calculateItemTotal: (item: CartItemType) => number;
}

const CartItem = ({
  item,
  index,
  onRemove,
  onQuantityChange,
  onModifierToggle,
  onDiscountToggle,
  calculateItemTotal,
}: CartItemProps) => {
  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-medium">{item.product.name}</h3>
          <p className="text-sm text-gray-500">
            ${item.product.price.toFixed(2)}
          </p>
        </div>
        <button
          onClick={() => onRemove(item.product._id)}
          className="text-red-500 hover:text-red-700"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="flex items-center gap-2 mt-2">
        <button
          onClick={() => onQuantityChange(item.product._id, -1)}
          className="p-1 rounded-full bg-gray-200 hover:bg-gray-300"
        >
          <Minus className="h-4 w-4" />
        </button>
        <span className="w-8 text-center">{item.quantity}</span>
        <button
          onClick={() => onQuantityChange(item.product._id, 1)}
          className="p-1 rounded-full bg-gray-200 hover:bg-gray-300"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      {item.product.modifiers && item.product.modifiers.length > 0 && (
        <div className="mt-2">
          <p className="text-sm font-medium">Modifiers:</p>
          {item.product.modifiers.map((modifier: any) => (
            <div key={modifier.name} className="ml-2">
              <p className="text-sm text-gray-600">{modifier.name}</p>
              <div className="flex flex-wrap gap-2 mt-1">
                {modifier.options.map((option: any) => (
                  <button
                    key={option.name}
                    onClick={() => onModifierToggle(index, modifier, option)}
                    className={`text-xs px-2 py-1 rounded ${
                      item.selectedModifiers.some(
                        (m) =>
                          m.name === modifier.name &&
                          m.option.name === option.name
                      )
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-200'
                    }`}
                  >
                    {option.name} (+${option.price.toFixed(2)})
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {item.product.discounts && item.product.discounts.length > 0 && (
        <div className="mt-2">
          <p className="text-sm font-medium">Discounts:</p>
          <div className="flex flex-wrap gap-2 mt-1">
            {item.product.discounts.map((discount: any) => (
              <button
                key={discount.name}
                onClick={() => onDiscountToggle(index, discount)}
                className={`text-xs px-2 py-1 rounded ${
                  item.selectedDiscounts.some(
                    (d) => d.name === discount.name
                  )
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-200'
                }`}
              >
                {discount.name} (
                {discount.type === 'percentage'
                  ? `-${discount.value}%`
                  : `-$${discount.value}`}
                )
              </button>
            ))}
          </div>
        </div>
      )}

      <p className="mt-2 text-right font-medium">
        ${calculateItemTotal(item).toFixed(2)}
      </p>
    </div>
  );
};

export default CartItem;