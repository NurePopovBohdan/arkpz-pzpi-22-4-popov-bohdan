require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const router = require("./router/index");
const errorMiddleware = require("./middlewares/error-middleware");

const mqtt = require("mqtt");

// MQTT broker URL and topic configuration
const brokerUrl = "mqtt://broker.hivemq.com";
const topic = "iot/data";

// Connect to MQTT broker
const mqttClient = mqtt.connect(brokerUrl);

mqttClient.on("connect", () => {
  console.log("Connected to MQTT broker");

  // Subscribe to the specified topic
  mqttClient.subscribe(topic, (err) => {
    if (err) {
      console.error("Failed to subscribe to topic:", err);
    } else {
      console.log(`Successfully subscribed to topic: ${topic}`);
    }
  });
});

// Handle incoming MQTT messages
mqttClient.on("message", async (topic, message) => {
  try {
    const data = JSON.parse(message.toString());
    console.log("Received data:", data);

    // Save data to MongoDB
    const Data = require("./models/Data");
    const newData = new Data(data);
    await newData.save();
    console.log("Data successfully saved to MongoDB");
  } catch (err) {
    console.error("Error processing MQTT message:", err);
  }
});

// Handle MQTT errors
mqttClient.on("error", (err) => {
  console.error("MQTT connection error:", err);
});

const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");

const PORT = process.env.PORT || 5000;
const app = express();

// Middleware to serve Swagger documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Middleware setup
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    credentials: true,
    origin: process.env.CLIENT_URL, // CORS configuration for client URL
  })
);

// API routes
app.use("/api", router);
app.use(errorMiddleware); // Error handling middleware

// Start the server and connect to the database
const start = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Start the server
    app.listen(PORT, () => {
      console.log(`Server started on PORT = ${PORT}`);
      console.log(
        `Swagger docs available at http://localhost:${PORT}/api-docs`
      );
    });
  } catch (err) {
    console.error("Error starting server:", err);
  }
};

// Invoke the start function
start();
