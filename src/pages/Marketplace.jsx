import React, { useState, useEffect } from 'react';
import supabase from '../supabaseClient';
import '../styles/marketplace.css';

const Marketplace = () => {
  const [productName, setProductName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [subCategory, setSubCategory] = useState('');
  const [condition, setCondition] = useState('');
  const [price, setPrice] = useState('');
  const [file, setFile] = useState(null);
  const [productList, setProductList] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState('');
  const [locationQuery, setLocationQuery] = useState('');
  const [showSellerForm, setShowSellerForm] = useState(false);
  const [sellerTier, setSellerTier] = useState('Regular');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showCheckout, setShowCheckout] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [chatMessage, setChatMessage] = useState('');

  // Fetch products on component mount
  useEffect(() => {
    fetchProducts();
  }, []);

  // Fetch products from the database
  const fetchProducts = async () => {
    const { data, error } = await supabase.from('products_table').select('*');
    if (error) {
      console.error('Error fetching products:', error);
    } else {
      setProductList(data);
    }
  };

  // Handle file selection
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.size <= 5 * 1024 * 1024) { // 5MB limit
      setFile(selectedFile);
    } else {
      alert('Please select a file less than 5MB.');
    }
  };

  // Add a new product
  const handleAddProduct = async () => {
    if (!productName || !description || !category || !condition || !price || !file) {
      alert('Please fill all the fields');
      return;
    }

    // Get the current user's ID
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    const owner_id = user?.id;

    if (!owner_id) {
      alert('You must be logged in to add a product.');
      return;
    }

    try {
      // Step 1: Upload the file to Supabase Storage
      const filePath = `marketplace/${user.id}/${Date.now()}-${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from('marketplace_images')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      // Step 2: Get the public URL of the uploaded file
      const { data: urlData } = supabase.storage
        .from('marketplace_images')
        .getPublicUrl(filePath);

      const imageUrl = urlData.publicUrl;

      // Step 3: Add the product to the database with the image URL and owner_id
      const newProduct = {
        productName,
        description,
        category,
        subCategory,
        condition,
        price: parseFloat(price),
        tier: sellerTier,
        location: locationQuery,
        file: imageUrl,
        owner_id,
      };

      const { data: productData, error: productError } = await supabase
        .from('products_table')
        .insert([newProduct])
        .select();

      if (productError) {
        throw productError;
      }

      // Step 4: Add the image metadata to the `marketplace_images` table
      const { error: imageError } = await supabase
        .from('marketplace_images')
        .insert([
          {
            file_path: filePath,
            owner_id: user.id,
            product_id: productData[0].id,
            public_url: imageUrl,
          },
        ]);

      if (imageError) {
        throw imageError;
      }

      // Step 5: Update the product list in real-time
      setProductList([...productList, productData[0]]);

      // Step 6: Reset the form fields
      setProductName('');
      setDescription('');
      setCategory('');
      setSubCategory('');
      setCondition('');
      setPrice('');
      setFile(null);
      setShowSellerForm(false);

      // Step 7: Scroll to the relevant section based on the seller's tier
      const section = sellerTier === 'Gold' ? '.featured' : sellerTier === 'Premium' ? '.new-arrivals' : '.top-sales';
      const element = document.querySelector(section);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      } else {
        console.error(`Element with selector '${section}' not found.`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert(`An error occurred: ${error.message}`);
    }
  };

  // Handle "Buy Now" button click
  const handleBuyNow = (product) => {
    setSelectedProduct(product);
    setShowCheckout(true);
  };

  // Handle payment confirmation
  const handlePaymentConfirmation = () => {
    setShowChat(true);
    setShowCheckout(false);
  };

  // Close the live chat modal
  const handleCloseChat = () => {
    setShowChat(false);
    setChatMessage('');
  };

  // Send a chat message
  const handleSendMessage = () => {
    if (chatMessage.trim()) {
      console.log('Message sent:', chatMessage);
      setChatMessage('');
      alert('Your message has been sent!');
    } else {
      alert('Please type a message.');
    }
  };

  // Filter products based on search, price range, and location
  const filteredProducts = productList.filter((product) => {
    const matchesSearch = product.productName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPriceRange = priceRange ? product.price <= parseInt(priceRange) : true;
    const matchesLocation = product.location.toLowerCase().includes(locationQuery.toLowerCase());
    return matchesSearch && matchesPriceRange && matchesLocation;
  });

  // Categorize products by tier
  const featuredProducts = productList.filter((product) => product.tier === 'Gold');
  const newArrivals = productList.filter((product) => product.tier === 'Premium');
  const topSales = productList.filter((product) => product.tier === 'Regular');

  return (
    <div className="marketplace-container">
      <h1>Welcome to the Marketplace</h1>
      <h2>10% DISCOUNT EVERY WEEKEND</h2>

      <div className="promo-banner">
        <p>Promo: Discounts Inside | Buy & Sell Near You</p>
      </div>

      <div className="shop-buttons">
        <button className="shop-btn" onClick={() => {
          const element = document.querySelector('.product-sections');
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          } else {
            console.error('Element with selector .product-sections not found.');
          }
        }}>
          Shop From Us
        </button>
        <button className="shop-btn" onClick={() => setShowSellerForm(!showSellerForm)}>
          Sell With Us
        </button>
      </div>

      <div className="search-filters">
        <input
          type="text"
          placeholder="What are you looking for? (e.g., scented candles, shoes, computers)"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <input
          type="text"
          placeholder="Location (e.g., Nairobi, Westlands, Mombasa Road)"
          value={locationQuery}
          onChange={(e) => setLocationQuery(e.target.value)}
        />
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">Select Category</option>
          <option value="Home">Home</option>
          <option value="Electronics">Electronics</option>
          <option value="Fashion">Fashion</option>
          <option value="Furniture">Furniture</option>
          <option value="Stationery">Stationery</option>
        </select>
        <select value={priceRange} onChange={(e) => setPriceRange(e.target.value)}>
          <option value="">Price Range</option>
          <option value="500">Under 500 KES</option>
          <option value="1000">Under 1,000 KES</option>
          <option value="2500">Under 2,500 KES</option>
          <option value="5000">Under 5,000 KES</option>
          <option value="10000">Under 10,000 KES</option>
          <option value="20000">Under 20,000 KES</option>
          <option value="50000">Under 50,000 KES</option>
        </select>
      </div>

      <div className="main-content">
        <div className="browse-categories">
          <h3>Browse Categories</h3>
          <ul>
            <li>Home</li>
            <li>Beauty</li>
            <li>
              Fashion
              <ul>
                <li>Mens Wear</li>
                <li>Ladies Wear</li>
                <li>Kids Wear</li>
              </ul>
            </li>
            <li>
              Electronics
              <ul>
                <li>Computers</li>
                <li>Machines</li>
              </ul>
            </li>
            <li>Furniture</li>
            <li>Stationery (Books)</li>
            <li>E-Books</li>
          </ul>
        </div>

        <div className="product-sections">
          {featuredProducts.length > 0 && (
            <div className="featured">
              <h3>Featured Listing (Gold - 800 KES)</h3>
              <div className="product-grid featured-grid">
                {featuredProducts.map((product) => (
                  <div key={product.id} className="product-card">
                    <img src={product.file} alt={product.productName} />
                    <p>{product.productName}</p>
                    <p>{product.price} KES</p>
                    <button onClick={() => handleBuyNow(product)}>Buy Now</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {newArrivals.length > 0 && (
            <div className="new-arrivals">
              <h3>New Arrivals (Premium - 500 KES)</h3>
              <div className="product-grid new-arrivals-grid">
                {newArrivals.map((product) => (
                  <div key={product.id} className="product-card">
                    <img src={product.file} alt={product.productName} />
                    <p>{product.productName}</p>
                    <p>{product.price} KES</p>
                    <button onClick={() => handleBuyNow(product)}>Buy Now</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {topSales.length > 0 && (
            <div className="top-sales">
              <h3>Top Sales (Regular - 300 KES)</h3>
              <div className="product-grid top-sales-grid">
                {topSales.map((product) => (
                  <div key={product.id} className="product-card">
                    <img src={product.file} alt={product.productName} />
                    <p>{product.productName}</p>
                    <p>{product.price} KES</p>
                    <button onClick={() => handleBuyNow(product)}>Buy Now</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {productList.length === 0 && (
            <div className="empty-state">
              <p>No products listed yet. Be the first to add a product!</p>
            </div>
          )}
        </div>
      </div>

      {showSellerForm && (
        <div className="add-product-form">
          <h3>Add a Product</h3>
          <input
            type="text"
            placeholder="Product Name"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
          />
          <textarea
            placeholder="Product Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">Select Category</option>
            <option value="Home">Home</option>
            <option value="Electronics">Electronics</option>
            <option value="Fashion">Fashion</option>
            <option value="Furniture">Furniture</option>
            <option value="Stationery">Stationery</option>
          </select>
          <select value={subCategory} onChange={(e) => setSubCategory(e.target.value)}>
            <option value="">Select Subcategory</option>
            {category === 'Fashion' && (
              <>
                <option value="Mens Wear">Mens Wear</option>
                <option value="Ladies Wear">Ladies Wear</option>
                <option value="Kids Wear">Kids Wear</option>
              </>
            )}
            {category === 'Electronics' && (
              <>
                <option value="Computers">Computers</option>
                <option value="Machines">Machines</option>
              </>
            )}
          </select>
          <select value={condition} onChange={(e) => setCondition(e.target.value)}>
            <option value="">Select Condition</option>
            <option value="New">New</option>
            <option value="Used">Used</option>
          </select>
          <input
            type="number"
            placeholder="Price in KES"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
          <select value={sellerTier} onChange={(e) => setSellerTier(e.target.value)}>
            <option value="Regular">Regular (300 KES) - Top Sales</option>
            <option value="Premium">Premium (500 KES) - New Arrivals</option>
            <option value="Gold">Gold (800 KES) - Featured Listing</option>
          </select>
          <input
            type="text"
            placeholder="Location (e.g., Nairobi, Westlands, Mombasa Road)"
            value={locationQuery}
            onChange={(e) => setLocationQuery(e.target.value)}
          />
          <input type="file" onChange={handleFileChange} />
          {file && (
            <div className="image-preview">
              <img src={URL.createObjectURL(file)} alt="Preview" />
            </div>
          )}
          <button onClick={handleAddProduct}>Add Product</button>
          <p className="payment-instructions">
            Pay via M-Pesa: 0768063078 (Pochi la Biashara). Upload proof of payment within 24 hours, or your listing will be removed.
            <br />
            <strong>800 KES - Featured Listing (Gold)</strong>
            <br />
            <strong>500 KES - New Arrivals (Premium)</strong>
            <br />
            <strong>300 KES - Top Sales (Regular)</strong>
          </p>
        </div>
      )}

      {showCheckout && selectedProduct && (
        <div className="checkout-modal">
          <h3>Checkout</h3>
          <p>Product: {selectedProduct.productName}</p>
          <p>Price: {selectedProduct.price} KES</p>
          <p>Pay via M-Pesa: 0768063078 (Pochi la Biashara)</p>
          <button onClick={handlePaymentConfirmation}>Confirm Payment</button>
          <button onClick={() => setShowCheckout(false)}>Close</button>
        </div>
      )}

      {showChat && (
        <div className="live-chat">
          <h3>Live Chat</h3>
          <p>Please share your M-Pesa confirmation message here.</p>
          <textarea
            placeholder="Type your message..."
            value={chatMessage}
            onChange={(e) => setChatMessage(e.target.value)}
          />
          <button onClick={handleSendMessage}>Send</button>
          <button onClick={handleCloseChat}>Close</button>
          <a
            href="https://wa.me/254768063078"
            target="_blank"
            rel="noopener noreferrer"
            className="whatsapp-link"
          >
            Contact via WhatsApp
          </a>
        </div>
      )}
    </div>
  );
};

export default Marketplace;