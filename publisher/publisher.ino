#include <WiFi.h>
#include <WiFiClient.h>
#include <PubSubClient.h>//https://pubsub.knolleary.net/api
//#include <WiFiServer.h>
/******Keys*******/
const char* WIFISSID = "Totalplay-149E";//"CharlieGDrummer";//"IoT";
const char* PASSWORD = "149E37A6ZuSf63st";//"policeerr";//"1t3s0IoT18";

const char* mqtt_client = "ESP32";
const char* deviceTopic = "TOPIC_MQTT";
const char* mqtt_server ="0.tcp.ngrok.io";
#define mqtt_port 19990
//#define mqtt_port 2883
#define led_pin 12

/******Keys*******/


  void callback(char* topic, byte* payload, unsigned int length) {
    Serial.println("callback");
      char p[length + 1];
      memcpy(p, payload, length);
      p[length] = NULL;
      String message(p);
      Serial.write(payload, length);
      Serial.println(topic);
  }

  const char* willTopic = "WilllMsg";
  const char* willPayload = "ESP32 Connection Closed abnormally..!";
  WiFiClient wificlient;
  PubSubClient publisher(wificlient);
  void reconnect() {
     while (!publisher.connected()) {
       Serial.println("Attempting MQTT connection...");
       Serial.println(mqtt_client);
       // Attemp to connect
       if (publisher.connect(mqtt_client, "username", "password", willTopic, 1, true, willPayload)) {
        Serial.print("Connected to server: ");
        Serial.println(mqtt_client);
        Serial.print("///////////////////////////");
       } 
       else {
         Serial.print("Failed, rc=");
         Serial.print(publisher.state());
         Serial.println(" try again in 2 seconds");
         // Wait 2 seconds before retrying
         delay(2000);
       }
     }
     Serial.println("Subscribing to topic");
     Serial.println(deviceTopic);
     publisher.unsubscribe(deviceTopic);
     publisher.subscribe(deviceTopic, 1);
  }

  void loop() {
    Serial.println("Loop");
    if (!publisher.connected()) {
      Serial.println("int");
      reconnect();
      delay(1000);
    }
    else delay(500);
    Serial.println("out");
    Serial.println(publisher.publish(deviceTopic, "TEST INO"));
  }
  void setup() { //needs: WIFISSID, PASSWORD
    Serial.begin(115200);
    WiFi.begin(WIFISSID, PASSWORD);

    Serial.println();
    Serial.print("Wait for WiFi...");

    while (WiFi.status() != WL_CONNECTED) {
      Serial.print(".");
      delay(500);
    }

    Serial.println("");
    Serial.println("WiFi Connected");
    Serial.println("IP address: ");
    Serial.println(WiFi.localIP());
    publisher.setServer(mqtt_server, mqtt_port);
    publisher.setCallback(callback);
    pinMode(led_pin, OUTPUT);
    digitalWrite(led_pin, HIGH);
  }