"use strict";
const path = require("path");
const express = require("express");
const fs = require("fs");
const https = require('https');
const hsts = require('hsts');

const PORT = process.env.PORT || 5050;
const app = express();

const distPath = path.join(__dirname, "..", "client", "dist");
app.use(express.static(distPath));

// API routes
app.get("/api/hello", (req, res) => {
  res.json({
    message: "Hello from the Express server!",
    timestamp: new Date().toISOString(),
  });
});

//API  use routes

const questRoutes = require("./routes/questRoutes");
app.use("/api/quests", questRoutes);

const userRoutes = require("./routes/userRoutes");
app.use("/api/users", userRoutes);

const rankRoutes = require("./routes/rankRoutes");
app.use("/api/rank", rankRoutes);

const badgesRoutes = require("./routes/badgesRoutes");
app.use("/api/badges", badgesRoutes);

const dailyQuoteRoutes = require("./routes/dailyQuoteRoutes");
app.use("/api/dailyquotes", dailyQuoteRoutes);

// GET a specific quest
// app.get("/quests/:id", (req, res) => {
//   fs.readFile("./db.json", "utf8", (err, data) => {
//     if (err) {
//       res.status(500).json({ error: "Failed to read database" });
//       return;
//     }
//     const db = JSON.parse(data);
//     const quest = db.quests.find(
//       (quest) => quest.id === Number.parseInt(req.params.id),
//     );
//     if (!quest) {
//       res.status(404).json({ error: "Quest not found" });
//       return;
//     }
//     res.status(200).json(quest);
//   });
// });

// GET a specific user
// app.get("/users/:id", (req, res) => {
//   fs.readFile("./db.json", "utf8", (err, data) => {
//     if (err) {
//       res.status(500).json({ error: "Failed to read database" });
//       return;
//     }
//     const db = JSON.parse(data);
//     const user = db.users.find(
//       (user) => user.id === Number.parseInt(req.params.id),
//     );
//     if (!user) {
//       res.status(404).json({ error: "User not found" });
//       return;
//     }
//     res.status(200).json(user);
//   });
// });

// SPA fallback
app.get("/*splat", (req, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal Server Error" });
});

// Apply HSTS middleware to the HTTPS server
const hstsOptions = {
    maxAge: 31536000, // 1 year in seconds
    includeSubDomains: true, // Apply HSTS to all subdomains
    preload: true // Include this site in the HSTS preload list
};

// Create HTTPS server with SSL certificate
const options = {
    key: fs.readFileSync('private-key.pem'), // Path to your private key
    cert: fs.readFileSync('certificate.pem'), // Path to your certificate
};

// Create HTTPS server
const httpsServer = https.createServer(options, (req, res) => {
    // Apply HSTS middleware
    hsts(hstsOptions)(req, res, () => {
        app(req, res);
    });
});

// start the Express server
httpsServer.listen(PORT, () => {
    console.log(`HTTPS Server running at https://localhost:${PORT}`);
});
