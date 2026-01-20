
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

const { connectDB } = require("./config/db");

dotenv.config();

const app = express();

app.use(cors()); 
app.use(express.json());


connectDB().then(() => {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
  })
})


app.get('/', (req, res) => {
  res.status(200).send('Alhamdulillah! Ramadan Project Backend is Running Successfully.');
});
