import React, { useState, useEffect } from "react";
import "./App.css";
import SpeechToText from "./components/SpeechToText";
import ProductList from "./components/ProductList";
import ErrorBoundary from "./components/ErrorBoundary";
import axios from "axios";

function App() {
    const [searchQuery, setSearchQuery] = useState(""); // State for user query
    const [selectedCategory, setSelectedCategory] = useState(""); // State for category filter
    const [products, setProducts] = useState([]); // State for product list
    const [error, setError] = useState(""); // State for error messages

    // Fetch products based on searchQuery or category
    useEffect(() => {
        const fetchProducts = async () => {
            const queryParam = searchQuery || selectedCategory
                ? `?q=${encodeURIComponent(searchQuery)}&category=${encodeURIComponent(selectedCategory)}`
                : "";

            const url = `http://localhost:5000/api/products${queryParam}`;

            try {
                const response = await axios.get(url);
                console.log("Fetched products:", response.data); // Debugging
                setProducts(response.data);
            } catch (err) {
                console.error("Error fetching products:", err);
                setError("Failed to load products. Please try again.");
            }
        };

        fetchProducts();
    }, [searchQuery, selectedCategory]); // Fetch products whenever searchQuery or selectedCategory changes

    // Handle transcription result from SpeechToText
    const handleTranscription = (transcription) => {
        console.log("Transcribed query:", transcription); // Debugging
        setSearchQuery(transcription); // Update the query state with transcribed text
    };

    // Handle category selection
    const handleCategoryChange = (category) => {
        console.log("Selected category:", category); // Debugging
        setSelectedCategory(category); // Update selected category
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

                    {/* ProductList Component */}
                    <ProductList searchQuery={searchQuery} category={selectedCategory} />
                    {error && <p className="error">{error}</p>}
                </header>
            </div>
        </ErrorBoundary>
    );
}

export default App;
