
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
const tryFreeRoutes = require('./routes/Home_Routes/tryFreeRoutes.route');
const servicesRoutes = require('./routes/Services_Routes/servicesRoutes.route');
const homeRoutes = require("./routes/Home_Routes/homesection.route");
const contactMessageRoute = require("./routes/Contact_Routes/contactForm.route");
const startusMessageRoute = require("./routes/startUs_Routes/startus.route")


// home section 
app.use("/home-section", homeRoutes);

// contact form 
app.use("/contact" , contactMessageRoute)

//start up
app.use("/startus" , startusMessageRoute)

//api home
app.use('/home/pricing', pricingRoutes);
app.use('/home/try-free', tryFreeRoutes);

// api services 
app.use('/service/services', servicesRoutes);

app.get('/', (req, res) => {
  res.status(200).send('Alhamdulillah! Mongodb is Running Successfully.');
});


connectDB().then(() => {
  if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  }
});

module.exports = app;