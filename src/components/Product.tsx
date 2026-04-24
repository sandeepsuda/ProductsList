import React from 'react';
import { Edit2, Eye, Trash2 } from 'lucide-react';

interface ProductProps {
  name: string;
  category: string;
  quantity: number;
  price: number;
}

const Product: React.FC<ProductProps> = ({ name, category, quantity, price }) => {
  const getStatus = (qty: number) => {
    if (qty < 15) return { label: 'Low Stock', class: 'status-low' };
    if (qty <= 30) return { label: 'Medium', class: 'status-med' };
    return { label: 'In Stock', class: 'status-high' };
  };

  const status = getStatus(quantity);

  return (
    <tr className="product-row">
      <td>
        <span className="product-name">{name}</span>
      </td>

      <td className="product-category">
        <span className="category-tag">{category}</span>
      </td>

      <td className="product-quantity">
        <span className="quantity-text">{quantity}</span>
      </td>

      <td>
        <span className={`status-badge ${status.class}`}>
          {status.label}
        </span>
      </td>

      <td className="product-price text-right">
        ${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </td>

      <td className="text-right">
        <div className="action-buttons">
          <button className="action-btn view-btn" title="View Details">
            <Eye size={18} />
          </button>
          <button className="action-btn edit-btn" title="Edit Product">
            <Edit2 size={18} />
          </button>
          <button className="action-btn delete-btn" title="Delete Product">
            <Trash2 size={18} />
          </button>
        </div>
      </td>
    </tr>
  );
};

export default Product;
