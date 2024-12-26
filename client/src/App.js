import React, { useState, useEffect } from "react";
import "./App.css";
import SpeechToText from "./components/SpeechToText";
import ProductList from "./components/ProductList";
import ErrorBoundary from "./components/ErrorBoundary";
import axios from "axios"; // Import axios for API calls

function App() {
    const [searchQuery, setSearchQuery] = useState(""); // State for voice-based query
    const [selectedCategory, setSelectedCategory] = useState(""); // State for category filter
    const [products, setProducts] = useState([]); // State to hold fetched products
    const [loading, setLoading] = useState(false); // State for loading indicator
    const [error, setError] = useState(""); // State for error messages

    // Fetch products from the server based on the query and category
    useEffect(() => {
        const fetchProducts = async () => {
            if (!searchQuery) return; // Avoid making API calls with empty query

            setLoading(true);
            setError("");

            try {
                const response = await axios.post("http://localhost:5000/api/ai-assistant", {
                    query: searchQuery,
                });

                setProducts(response.data.results); // Update products with backend response
            } catch (err) {
                setError("Failed to fetch products. Please try again.");
                console.error("Error fetching products:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [searchQuery]);

    // Handle transcription result from SpeechToText component
    const handleTranscription = (transcription) => {
        setSearchQuery(transcription); // Update the query state with the transcription
    };

    // Handle category selection
    const handleCategoryChange = (category) => {
        setSelectedCategory(category); // Update selected category state
    };

    return (
        <ErrorBoundary>
            <div className="App">
                <header className="App-header">
                    <h1>Voice Shopping Assistant</h1>

                    {/* SpeechToText Component */}
                    <SpeechToText onTranscribe={handleTranscription} />

                    {/* Category Filter Buttons */}
                    <div className="category-filters">
                        {["", "Fashion", "Electronics", "Accessories", "Home"].map((category) => (
                            <button
                                key={category}
                                onClick={() => handleCategoryChange(category)}
                                className={selectedCategory === category ? "active" : ""}
                            >
                                {category || "All"}
                            </button>
                        ))}
                    </div>

                    {/* Loading Indicator */}
                    {loading && <p>Loading products...</p>}

                    {/* Error Message */}
                    {error && <p className="error">{error}</p>}

                    {/* ProductList Component */}
                    <ProductList products={products} category={selectedCategory} />
                </header>
            </div>
        </ErrorBoundary>
    );
}

export default App;
