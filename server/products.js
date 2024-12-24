require("dotenv").config();

const BASE_URL = process.env.BASE_URL || "http://localhost:5000"; // Use localhost if BASE_URL is undefined

//console.log("BASE_URL:", BASE_URL); // Debug to verify the value is loaded

// Product data
const products = [
    {
        id: 1,
        name: "Red Shoes",
        price: 50,
        image: `${BASE_URL}/images/red-shoes.png`,
        description: "Stylish red shoes perfect for casual outings.",
        category: "Fashion",
    },
    {
        id: 2,
        name: "Blue T-Shirt",
        price: 20,
        image: `${BASE_URL}/images/blue-tshirt.png`,
        description: "Comfortable blue t-shirt for everyday wear.",
        category: "Fashion",
    },
    {
        id: 3,
        name: "Smartphone",
        price: 500,
        image: `${BASE_URL}/images/smartphone.png`,
        description: "A powerful smartphone with the latest features.",
        category: "Electronics",
    },
    {
        id: 4,
        name: "Wireless Headphones",
        price: 150,
        image: `${BASE_URL}/images/wireless-headphones.png`,
        description: "Noise-canceling wireless headphones for music lovers.",
        category: "Electronics",
    },
    {
        id: 5,
        name: "Laptop",
        price: 1200,
        image: `${BASE_URL}/images/laptop.png`,
        description: "High-performance laptop for work and gaming.",
        category: "Electronics",
    },
    {
        id: 6,
        name: "Sports Watch",
        price: 250,
        image: `${BASE_URL}/images/watch.png`,
        description: "Track your fitness and health with this sports watch.",
        category: "Accessories",
    },
    {
        id: 7,
        name: "Sunglasses",
        price: 100,
        image: `${BASE_URL}/images/sunglasses.png`,
        description: "Stylish sunglasses to protect your eyes and enhance your look.",
        category: "Accessories",
    },
    {
        id: 8,
        name: "Backpack",
        price: 80,
        image: `${BASE_URL}/images/backpack.png`,
        description: "Durable and spacious backpack for your travel needs.",
        category: "Accessories",
    },
    {
        id: 9,
        name: "Coffee Mug",
        price: 15,
        image: `${BASE_URL}/images/coffee-mug.png`,
        description: "Perfect coffee mug to start your day right.",
        category: "Home",
    },
    {
        id: 10,
        name: "Desk Lamp",
        price: 40,
        image: `${BASE_URL}/images/desk-lamp.png`,
        description: "Modern desk lamp to brighten up your workspace.",
        category: "Home",
    },
];

module.exports = products;