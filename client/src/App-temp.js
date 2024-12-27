import React, { useState, useEffect } from "react";
import "./App.css";
import SpeechToText from "./components/SpeechToText";
import ProductList from "./components/ProductList";
import ErrorBoundary from "./components/ErrorBoundary";
import axios from "axios";

function App() {
    const [searchQuery, setSearchQuery] = useState(""); // State for search queries
    const [category, setCategory] = useState(""); // State for selected category
    const [products, setProducts] = useState([]); // State for product list
    const [error, setError] = useState(""); // State for error messages

    // Fetch products based on searchQuery or category
    useEffect(() => {
        const fetchProducts = async () => {
            const queryParam = searchQuery || category ? `?q=${encodeURIComponent(searchQuery)}&category=${encodeURIComponent(category)}` : "";
            const url = `http://localhost:5000/api/products${queryParam}`;

            try {
                const response = await axios.get(url);
                setProducts(response.data);
            } catch (err) {
                console.error("Error fetching products:", err);
                setError("Failed to load products. Please try again.");
            }
        };

        fetchProducts();
    }, [searchQuery, category]); // Fetch products whenever searchQuery or category changes

    return (
        <ErrorBoundary>
            <div className="App">
                <header className="App-header">
                    <h1>Voice Shopping Assistant</h1>

                    {/* Category Filter Buttons */}
                    <div className="category-filters">
                        {["", "Fashion", "Electronics", "Accessories", "Home"].map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setCategory(cat)} // Update category state
                                className={category === cat ? "active" : ""}
                            >
                                {cat || "All"}
                            </button>
                        ))}
                    </div>

                    {/* ProductList Component */}
                    <ProductList products={products} />
                    {error && <p className="error">{error}</p>}
                </header>
            </div>
        </ErrorBoundary>
    );
}

export default App;
