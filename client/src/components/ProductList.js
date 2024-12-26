import React, { useState, useEffect } from "react";
import axios from "axios";
import "../ProductList.css"; // For styling
import BASE_URL from "../config";

const ProductList = ({ searchQuery, category }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false); // Add loading state
    const [error, setError] = useState(""); // Add error state

    useEffect(() => {
        const fetchProducts = async () => {
            if (!searchQuery && !category) return; // Avoid unnecessary API calls

            setLoading(true); // Start loading
            setError(""); // Reset error state

            try {
                const response = await axios.get(
                    `${BASE_URL}/api/products?q=${encodeURIComponent(searchQuery)}&category=${encodeURIComponent(category)}`
                );
                setProducts(response.data);
            } catch (error) {
                console.error("Error fetching products:", error);
                setError("Failed to fetch products. Please try again.");
            } finally {
                setLoading(false); // Stop loading
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
                                alt={product.name}
                                style={{ width: "100%", height: "150px", objectFit: "cover" }}
                                onError={(e) => (e.target.src = `${BASE_URL}/images/default.jpg`)} // Handle broken image URLs
                            />
                            <h3 style={{ color: "#007bff" }}>{product.name}</h3>
                            <p style={{ color: "#555" }}>{product.description}</p>
                            <p style={{ color: "#28a745", fontWeight: "bold" }}>${product.price}</p>
                        </div>
                    ))
                ) : (
                    <div>No products found.</div>
                )}
            </div>
        </div>
    );
};

export default ProductList;
