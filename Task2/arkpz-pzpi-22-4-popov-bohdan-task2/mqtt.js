const mqtt = require("mqtt");

// Подключение к брокеру
const brokerUrl = "mqtt://test.mosquitto.org";
const topic = "iot/project/data";

const client = mqtt.connect(brokerUrl);

client.on("connect", () => {
  console.log("Connected to MQTT broker");
  client.subscribe(topic, (err) => {
    if (err) {
      console.error("Failed to subscribe to topic:", err);
    } else {
      console.log(`Subscribed to topic: ${topic}`);
    }
  });
});
const Data = require("./models/Data");

client.on("message", async (topic, message) => {
  try {
    const data = JSON.parse(message.toString());
    console.log("Received data:", data);

    // Сохраняем в MongoDB
    const newData = new Data(data);
    await newData.save();

    console.log("Data saved to MongoDB");
  } catch (err) {
    console.error("Error processing MQTT message:", err);
  }
});

module.exports = client;
