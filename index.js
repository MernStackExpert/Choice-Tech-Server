
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

const { connectDB } = require("./config/db");

dotenv.config();

const app = express();

app.use(cors({
  origin: ["http://localhost:5000", "https://yourdomain.com"],
  credentials: true
}));

app.use(express.json());


// routes 
const pricingRoutes = require('./routes/Home_Routes/pricingRoutes.route');
const tryFreeRoutes = require('./routes/Home_Routes/tryFreeRoutes.route');
const servicesRoutes = require('./routes/Services_Routes/servicesRoutes.route');
const homeRoutes = require("./routes/Home_Routes/homesection.route");
const contactMessageRoute = require("./routes/Contact_Routes/contactForm.route");
const startusMessageRoute = require("./routes/startUs_Routes/startus.route")
const userAuthRoute = require("./routes/User_Route/userRoute.route")

// home section 
app.use("/home-section", homeRoutes);

// contact form 
app.use("/contact" , contactMessageRoute)

//start up
app.use("/startus" , startusMessageRoute)

// user auth 
app.use("/auth/user" , userAuthRoute)

//api home
app.use('/home/pricing', pricingRoutes);
app.use('/home/try-free', tryFreeRoutes);

// api services 
app.use('/service/services', servicesRoutes);

app.get('/', (req, res) => {
  res.status(200).send('Alhamdulillah! Mongodb is Running Successfully.');
});


const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});


module.exports = app;