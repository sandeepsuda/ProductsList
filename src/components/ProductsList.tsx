import React from 'react';
import Product from './Product';

interface ProductData {
  id: number;
  name: string;
  quantity: number;
  price: number;
}

interface ProductsListProps {
  products: ProductData[];
}

const ProductsList: React.FC<ProductsListProps> = ({ products }) => {
  return (
    <div className="products-table-container">
      <table className="products-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Product Name</th>
            <th>Quantity</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <Product
              key={product.id}
              id={product.id}
              name={product.name}
              quantity={product.quantity}
              price={product.price}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductsList;
