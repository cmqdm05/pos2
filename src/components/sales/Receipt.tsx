import React from 'react';
import { Receipt as ReceiptIcon } from 'lucide-react';
import { CartItem } from './types';

interface ReceiptProps {
  items: CartItem[];
  total: number;
  paymentMethod: string;
  date: Date;
  storeInfo: {
    name: string;
    address: string;
    phone: string;
  };
  onClose: () => void;
  onPrint: () => void;
}

const Receipt = ({
  items,
  total,
  paymentMethod,
  date,
  storeInfo,
  onClose,
  onPrint,
}: ReceiptProps) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-8 max-w-md w-full">
        <div className="text-center mb-6">
          <ReceiptIcon className="h-12 w-12 mx-auto text-indigo-600 mb-2" />
          <h2 className="text-2xl font-bold">{storeInfo.name}</h2>
          <p className="text-gray-500">{storeInfo.address}</p>
          <p className="text-gray-500">{storeInfo.phone}</p>
        </div>

        <div className="border-t border-b py-4 mb-4">
          <div className="space-y-2">
            {items.map((item, index) => (
              <div key={index} className="flex justify-between text-sm">
                <div>
                  <span className="font-medium">{item.product.name}</span>
                  <span className="text-gray-500 ml-2">x{item.quantity}</span>
                  {item.selectedModifiers.map((modifier, idx) => (
                    <div key={idx} className="text-xs text-gray-500 ml-4">
                      + {modifier.name}: {modifier.option.name}
                    </div>
                  ))}
                </div>
                <span>${(item.product.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2 mb-6">
          <div className="flex justify-between">
            <span className="font-medium">Total</span>
            <span className="font-bold">${total.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-500">
            <span>Payment Method</span>
            <span className="capitalize">{paymentMethod}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-500">
            <span>Date</span>
            <span>{date.toLocaleString()}</span>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={onPrint}
            className="flex-1 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700"
          >
            Print Receipt
          </button>
          <button
            onClick={onClose}
            className="flex-1 border border-gray-300 py-2 rounded-lg hover:bg-gray-50"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default Receipt;