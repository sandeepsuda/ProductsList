import React from 'react';

interface ProductProps {
  id: number;
  name: string;
  quantity: number;
  price: number;
}

const Product: React.FC<ProductProps> = ({ id, name, quantity, price }) => {
  const getStockStatus = (qty: number) => {
    if (qty <= 0) return 'out-of-stock';
    if (qty <= 10) return 'low-stock';
    return 'in-stock';
  };

  const stockStatus = getStockStatus(quantity);

  return (
    <tr className={`product-row ${stockStatus}`}>
      <td className="product-id">#{id}</td>
      <td className="product-name">
        <span className="name-text">{name}</span>
      </td>
      <td className="product-quantity">
        <span className={`quantity-badge ${stockStatus}`}>
          {quantity} {quantity === 1 ? 'item' : 'items'}
        </span>
      </td>
      <td className="product-price">${price.toFixed(2)}</td>
    </tr>
  );
};

export default Product;
