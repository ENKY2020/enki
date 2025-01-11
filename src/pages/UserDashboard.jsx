import React, { useState, useEffect } from 'react';
import supabase from '../supabaseClient';
import '../styles/userDashboard.css';

const UserDashboard = () => {
  const [userProducts, setUserProducts] = useState([]);

  // Fetch user's products on component mount
  useEffect(() => {
    fetchUserProducts();
  }, []);

  // Fetch products owned by the current user
  const fetchUserProducts = async () => {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError) {
      console.error('Error fetching user:', authError);
      return;
    }

    const { data, error } = await supabase
      .from('products_table')
      .select('*')
      .eq('owner_id', user.id);

    if (error) {
      console.error('Error fetching products:', error);
    } else {
      setUserProducts(data);
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
      fetchUserProducts();
    }
  };

  return (
    <div className="user-dashboard">
      <h2>Your Listings</h2>
      {userProducts.length > 0 ? (
        <ul>
          {userProducts.map((product) => (
            <li key={product.id}>
              <h3>{product.productName}</h3>
              <p>{product.description}</p>
              <p>{product.price} KES</p>
              <button onClick={() => handleDeleteProduct(product.id)}>Delete</button>
            </li>
          ))}
        </ul>
      ) : (
        <p>You have no listings yet.</p>
      )}
    </div>
  );
};

export default UserDashboard;