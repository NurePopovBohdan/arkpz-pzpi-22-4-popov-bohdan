require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const router = require("./router/index");
const errorMiddleware = require("./middlewares/error-middleware");

const mqtt = require("mqtt");

const brokerUrl = "mqtt://broker.hivemq.com";
const topic = "iot/data";

const mqttClient = mqtt.connect(brokerUrl);

mqttClient.on("connect", () => {
  console.log("Connected to MQTT broker");
  mqttClient.subscribe(topic, (err) => {
    if (err) {
      console.error("Failed to subscribe to topic:", err);
    } else {
      console.log(`Subscribed to topic: ${topic}`);
    }
  });
});

mqttClient.on("message", async (topic, message) => {
  try {
    const data = JSON.parse(message.toString());
    console.log("Received data:", data);

    const Data = require("./models/Data");

    const newData = new Data(data);
    await newData.save();

    console.log("Data saved to MongoDB");
  } catch (err) {
    console.error("Error processing MQTT message:", err);
  }
});

mqttClient.on("error", (err) => {
  console.error("MQTT connection error:", err);
});

const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");

const PORT = process.env.PORT || 5000;
const app = express();

// Middleware для Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    credentials: true,
    origin: process.env.CLIENT_URL,
  })
);
app.use("/api", router);
app.use(errorMiddleware);

const start = async () => {
  try {
    await mongoose.connect(process.env.DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    app.listen(PORT, () => {
      console.log(`Server started on PORT = ${PORT}`);
      console.log(
        `Swagger docs available at http://localhost:${PORT}/api-docs`
      );
    });
  } catch (err) {
    console.log(err);
  }
};

start();
