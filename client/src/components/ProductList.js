import React, { useState, useEffect } from "react";
import axios from "axios";
import "../ProductList.css"; // For styling
import BASE_URL from "../config";

const ProductList = ({ searchQuery, category }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false); // Loading state
    const [error, setError] = useState(""); // Error state

	useEffect(() => {
		const fetchProducts = async () => {
			setLoading(true);
			setError("");

			try {
				const url = searchQuery || category
					? `${BASE_URL}/api/products?q=${encodeURIComponent(searchQuery)}&category=${encodeURIComponent(category)}`
					: `${BASE_URL}/api/products`;

				const response = await axios.get(url);
				//console.log("API Response Products:", response.data); // Debugging
				setProducts(response.data); // Update products
			} catch (error) {
				console.error("Error fetching products:", error);
				setError(error.response?.data?.error || "Failed to fetch products. Please try again.");
			} finally {
				setLoading(false);
			}
		};

		fetchProducts();
	}, [searchQuery, category]);


    return (
        <div style={{ display: "flex", justifyContent: "center", padding: "20px" }}>
            <div
                style={{
                    maxWidth: "1200px",
                    width: "100%",
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                    gap: "20px",
                    justifyContent: "center",
                }}
            >
                {loading ? (
                    <p>Loading products...</p>
                ) : error ? (
                    <p className="error">{error}</p>
                ) : Array.isArray(products) && products.length > 0 ? (
                    products.map((product) => (
                        <div
                            key={product.id}
                            style={{
                                border: "1px solid #ccc",
                                borderRadius: "10px",
                                padding: "15px",
                                textAlign: "center",
                                backgroundColor: "#ffffff",
                                color: "#333",
                            }}
                        >
                            <img
                                src={`${BASE_URL}${product.image_url}`} // Prepend BASE_URL to image_url
                                alt={product.name || "Product Image"}
                                style={{ width: "100%", height: "150px", objectFit: "cover" }}
                                onError={(e) => (e.target.src = `${BASE_URL}/images/default.jpg`)} // Handle broken image URLs
                            />
                            <h3 style={{ color: "#007bff" }}>{product.name || "Unnamed Product"}</h3>
                            <p style={{ color: "#555" }}>{product.description || "No description available."}</p>
                            <p style={{ color: "#28a745", fontWeight: "bold" }}>${product.price || "N/A"}</p>
                        </div>
                    ))
                ) : (
                    <p>No products match your search criteria.</p>
                )}
            </div>
        </div>
    );
};

export default ProductList;
