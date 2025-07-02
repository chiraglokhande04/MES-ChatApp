const express = require("express")
const http = require("http")
const connectDB = require("./config/db")
// const session = require("express-session")
const app = express()
require('dotenv').config();

const server = http.createServer(app)
const PORT = process.env.PORT || 3000

const adminRouter = require("./routes/adminRouter")
const cors = require("cors");

app.use('/admin',adminRouter);

const startServer = async () => {
    try {
      await connectDB();
      server.listen(3000, () => { // Use server instead of app.listen
        console.log('Server is running on port 3000');
      });
  
    } catch (err) {
      console.log('Error in starting server or connecting DB', err);
    }
  };
  
  startServer();