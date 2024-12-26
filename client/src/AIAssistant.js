import React, { useState } from "react";
import axios from "axios";

const AIAssistant = ({ setProducts }) => {
    const [input, setInput] = useState(""); // State for user input
    const [response, setResponse] = useState(""); // State for AI response
    const [loading, setLoading] = useState(false); // State for loading indicator
    const [error, setError] = useState(""); // State for error messages

    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true); // Start loading
        setError(""); // Reset error state
        setResponse(""); // Clear previous AI response

        try {
            console.log("Sending query to AI assistant API:", input); // Debug log

            // Step 1: Send user query to AI Assistant API
            const result = await axios.post("http://localhost:5000/api/ai-assistant", {
                query: input,
            });

            console.log("AI Assistant API Response:", result.data); // Debug log
            const aiResponse = result.data.response;
            setResponse(aiResponse); // Update AI response state

            // Step 2: Trigger product search if search parameters are returned
            if (result.data.searchParams) {
                const { category, product } = result.data.searchParams;
                const query = category || product || ""; // Use category or product if available
                console.log("Fetching products for query:", query); // Debug log

                const productResult = await axios.get(
                    `http://localhost:5000/api/products?q=${encodeURIComponent(query)}`
                );
                setProducts(productResult.data); // Update product list
            }
        } catch (error) {
            console.error("Error communicating with AI Assistant API:", error);
            setError("Failed to process your request. Please try again.");
        } finally {
            setLoading(false); // Stop loading
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask me anything..."
                />
                <button type="submit" disabled={loading}>
                    {loading ? "Processing..." : "Submit"}
                </button>
            </form>

            {/* Display AI response */}
            {response && <p>AI Response: {response}</p>}

            {/* Display error message */}
            {error && <p className="error">{error}</p>}
        </div>
    );
};

export default AIAssistant;
