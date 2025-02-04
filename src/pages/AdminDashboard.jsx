import React, { useState, useEffect } from 'react';
import supabase from '../supabaseClient.js';
import '../styles/adminDashboard.css';

const AdminDashboard = () => {
  const [allProducts, setAllProducts] = useState([]);

  // Fetch all products on component mount
  useEffect(() => {
    fetchAllProducts();
  }, []);

  // Fetch all products from the database
  const fetchAllProducts = async () => {
    const { data, error } = await supabase
      .from('products_table')
      .select('*');

    if (error) {
      console.error('Error fetching products:', error);
    } else {
      setAllProducts(data);
    }
  };

  // Handle product deletion
  const handleDeleteProduct = async (productId) => {
    const { error } = await supabase
      .from('products_table')
      .delete()
      .eq('id', productId);

    if (error) {
      console.error('Error deleting product:', error);
    } else {
      // Refresh the product list
      fetchAllProducts();
    }
  };

  return (
    <div className="admin-dashboard">
      <h2>Admin Dashboard</h2>
      {allProducts.length > 0 ? (
        <ul>
          {allProducts.map((product) => (
            <li key={product.id}>
              <h3>{product.productName}</h3>
              <p>{product.description}</p>
              <p>{product.price} KES</p>
              <p>Owner: {product.owner_id}</p>
              <button onClick={() => handleDeleteProduct(product.id)}>Delete</button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No products listed yet.</p>
      )}
    </div>
  );
};

export default AdminDashboard;