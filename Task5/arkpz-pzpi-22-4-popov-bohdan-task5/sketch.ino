#include <WiFi.h>
#include <PubSubClient.h>
#include <OneWire.h>
#include <DallasTemperature.h>

// Wi-Fi settings
const char* ssid = "Wokwi-GUEST";
const char* password = "";

// MQTT settings
const char* mqtt_server = "broker.hivemq.com"; // MQTT broker address
const int mqtt_port = 1883; // MQTT port
const char* mqtt_topic = "iot/data"; // MQTT topic for publishing data

// Initialization
WiFiClient espClient;
PubSubClient client(espClient);

// Temperature sensor settings
#define ONE_WIRE_BUS 23 // DS18B20 sensor pin
OneWire oneWire(ONE_WIRE_BUS);
DallasTemperature sensors(&oneWire);

void setup() {
  Serial.begin(115200);
  WiFi.begin(ssid, password);
  
  // Wait for Wi-Fi connection with a timeout
  unsigned long startTime = millis();
  while (WiFi.status() != WL_CONNECTED) {
    if (millis() - startTime > 10000) {  // Timeout after 10 seconds
      Serial.println("Failed to connect to WiFi, check your connection.");
      return;
    }
    Serial.print(".");
    delay(500);
  }
  Serial.println("Connected to WiFi");

  client.setServer(mqtt_server, mqtt_port);
  sensors.begin();
}

void loop() {
  if (!client.connected()) {
    reconnect();
  }
  client.loop();

  // Request temperature from the sensor
  sensors.requestTemperatures();
  float temperature = sensors.getTempCByIndex(0);

  // Generate random GPS coordinates (latitude and longitude)
  float latitude = 48.8566 + (random(-500, 500) / 10000.0);  // More realistic latitude shift
  float longitude = 2.3522 + (random(-500, 500) / 10000.0);  // More realistic longitude shift
  float tirePressure = random(200, 350) / 10.0;  // Random tire pressure value

  // Publish data
  publishData(temperature, latitude, longitude, tirePressure);

  delay(5000); // Publish every 5 seconds
}

void publishData(float temperature, float latitude, float longitude, float tirePressure) {
  // Create JSON payload for MQTT
  String payload = String("{\"temperature\":") + temperature + 
                   ",\"latitude\":" + latitude + 
                   ",\"longitude\":" + longitude + 
                   ",\"tirePressure\":" + tirePressure + "}";

  // Publish the data to the MQTT broker
  if (client.publish(mqtt_topic, payload.c_str())) {
    Serial.println("Data published successfully");
  } else {
    Serial.println("Failed to publish data");
  }
}

void reconnect() {
  // Attempt to reconnect to the MQTT server
  while (!client.connected()) {
    Serial.print("Attempting MQTT connection...");
    if (client.connect("ESP32Client")) {
      Serial.println("Connected to MQTT broker");
    } else {
      Serial.print("Failed, rc=");
      Serial.print(client.state());
      Serial.println(" Try again in 5 seconds.");
      delay(5000);  // Wait before retrying
    }
  }
}
