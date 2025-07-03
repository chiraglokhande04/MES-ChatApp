const express = require("express")
const http = require("http")
const connectDB = require("./config/db")
// const session = require("express-session")
const app = express()
require('dotenv').config();

const server = http.createServer(app)
const PORT = process.env.PORT || 3000

const adminRouter = require("./routes/adminRouter")
const userRouter = require("./routes/userRouter")
const cors = require("cors");

app.use('/api/admin',adminRouter);
app.use('/api/user',userRouter);

const startServer = async () => {
    try {
      await connectDB();
      server.listen(PORT, () => { // Use server instead of app.listen
        console.log(`Server is running on port ${PORT}`);
      });
  
    } catch (err) {
      console.log('Error in starting server or connecting DB', err);
    }
  };
  
  startServer();