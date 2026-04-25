import React, { useState } from 'react';
import { Edit2, Eye, Trash2, Box, DollarSign, Activity, AlertTriangle } from 'lucide-react';
import { getStatus } from '../helpers/productHelpers';
import '../styles/DeleteConfirmationModal.css';

interface ProductProps {
  id: number;
  name: string;
  category: string;
  quantity: number;
  price: number;
  onDelete: (id: number) => void;
}

const Product: React.FC<ProductProps> = ({ id, name, category, quantity, price, onDelete }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  const status = getStatus(quantity);
  const totalValue = quantity * price;

  const handleDelete = () => {
    onDelete(id);
    setShowDeleteModal(false);
  };

  return (
    <>
      <tr className={`product-row ${isExpanded ? 'is-expanded' : ''}`}>
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
            <button 
              className={`action-btn view-btn ${isExpanded ? 'active' : ''}`} 
              title="View Details"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              <Eye size={18} />
            </button>
            <button className="action-btn edit-btn" title="Edit Product">
              <Edit2 size={18} />
            </button>
            <button 
              className="action-btn delete-btn" 
              title="Delete Product"
              onClick={() => setShowDeleteModal(true)}
            >
              <Trash2 size={18} />
            </button>
          </div>
        </td>
      </tr>
      
      {isExpanded && (
        <tr className="detail-row animate-slide-down">
          <td colSpan={6}>
            <div className="product-details-grid">
              <div className="detail-item">
                <div className="detail-label">
                  <Box size={14} />
                  <span>Product ID</span>
                </div>
                <div className="detail-value">#{id.toString().padStart(5, '0')}</div>
              </div>
              
              <div className="detail-item">
                <div className="detail-label">
                  <DollarSign size={14} />
                  <span>Total Inventory Value</span>
                </div>
                <div className="detail-value">
                  ${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
              </div>

              <div className="detail-item">
                <div className="detail-label">
                  <Activity size={14} />
                  <span>Stock Status</span>
                </div>
                <div className="detail-value">
                  {quantity > 0 
                    ? `Currently ${status.label.toLowerCase()} with ${quantity} units available.` 
                    : 'This product is currently out of stock.'}
                </div>
              </div>
            </div>
          </td>
        </tr>
      )}

      {/* Custom Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal-overlay" onClick={() => setShowDeleteModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-icon-wrapper">
                <AlertTriangle size={24} />
              </div>
              <h3 className="modal-title">Delete Product</h3>
            </div>
            <div className="modal-body">
              <p>
                Are you sure you want to delete <span className="modal-product-name">"{name}"</span>? 
                This action cannot be undone and will permanently remove the item from your inventory.
              </p>
            </div>
            <div className="modal-footer">
              <button 
                className="modal-btn modal-btn-cancel" 
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>
              <button 
                className="modal-btn modal-btn-confirm" 
                onClick={handleDelete}
              >
                Delete Product
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Product;
