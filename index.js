
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

const { connectDB } = require("./config/db");

dotenv.config();

const app = express();

app.use(cors()); 
app.use(express.json());


// routes 
const pricingRoutes = require('./routes/Home_Routes/pricingRoutes.route');
const faqRoutes = require('./routes/Home_Routes/faqRoutes.route');
const purposeRoutes = require('./routes/Home_Routes/purposeRoutes.route');


connectDB().then(() => {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
  })
})


//api 
app.use('/home/pricing', pricingRoutes);
app.use('/home/faq', faqRoutes);
app.use('/home/purpose', purposeRoutes);



app.get('/', (req, res) => {
  res.status(200).send('Alhamdulillah! Ramadan Project Backend is Running Successfully.');
});
