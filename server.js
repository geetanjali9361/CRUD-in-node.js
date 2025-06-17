const express = require('express');
const { PORT } = require("./config");
const app = express();
app.use(express.json()); 

// Check if PORT is available
if (!PORT) {
    throw new Error("Port is required in the config file");
}
const sequelize = require('./database/db');

// Load and use middleware
// const middleware = require("./routes/middleware");
// middleware({ app }); 

// API routes
// const apiRoutes = require("./routes/api");
const authRoutes = require("./routes/auth");

app.use("/auth", authRoutes);
// app.use("/api", apiRoutes);

// Start the server
app.listen(PORT, () => {
    console.log(`The server is running on http://localhost:${PORT}`);
});
