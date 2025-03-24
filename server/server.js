import express from 'express'; // Use import instead of require  
import cors from 'cors';  

const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args)); // Dynamic import  
const app = express();  
const PORT = 5000; // You can choose any available port  

// Cấu hình cors
var corsOptions = {
  origin: "*", // Cho phép tất cả các miền
  methods: ['GET', 'POST'], // Các phương thức HTTP được phép
  allowedHeaders: ['Content-Type', 'Authorization'] // Các tiêu đề được phép
};

app.use(cors(corsOptions));

app.get('/api/hotels', async (req, res) => {  
  const { lat, lng } = req.query;  
  const apiKey = 'AIzaSyAhuvkbu8iQU3vptKQSbaHQNlTJv0ndTVw'; // Replace with your actual API Key  
  const response = await fetch(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=1500&type=lodging&key=${apiKey}`);  
  const data = await response.json();  
  res.json(data);  
});  

app.get('/api/restaurants', async (req, res) => {  
    const { lat, lng } = req.query;  
    const apiKey = 'AIzaSyAhuvkbu8iQU3vptKQSbaHQNlTJv0ndTVw'; // Replace with your actual API Key  
    const response = await fetch(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=1500&type=restaurant&key=${apiKey}`);  
    const data = await response.json();  
    res.json(data);  
});  

app.listen(PORT, () => {  
  console.log(`Server is running on http://localhost:${PORT}`);  
});