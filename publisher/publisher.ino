#include <WiFi.h>
#include <WiFiClient.h>
#include <PubSubClient.h>//https://pubsub.knolleary.net/api
#include "ThingSpeak.h"
#include "DHT.h"
#define pi 3.14159265358979323846
//#include <WiFiServer.h>

const char* deviceTopic = "device";
const char* mqtt_client "client";
const char* token = "token";
const char* mqtt_server = "localhost:3000/";

const char* WIFISSID = "CharlieGDrummer";//"IoT";
const char* PASSWORD = "policeerr";//"1t3s0IoT18";
float LAT = 0.1;
float LNG = 0.1;

String data;

class Publisher{
  private:
    PubSubClient* publisher;
  public:
    void publish(){
      buildData();
      publisher->publish(deviceTopic, data);
    };
    void buildData(){
      Serial.println("Building data...");
      sprintf(data, "%s", "{");
      sprintf(data, "%s\"%s\":%f , ",data, "Latitud", LAT);
      sprintf(data, "%s\"%s\":%f ", data, "Longitud", LNG);
      sprintf(data, "%s}", data);
    };
    void receive(char* t, byte* message, unsigned int length) {
      if(String(t) == deviceTopic){
        Serial.println(deviceTopic);
        String _message;
        for (int i = 0; i < length; i++) {
          _message += (char)message[i];
        }
        Serial.println(_message);
      }
      else Serial.printf("other topic: %s\n", deviceTopic);
    };
    bool reconnect(){
      while (!publisher->connected()) {
        Serial.println("Attempting MQTT connection...");
        // Attemp to connect
        if (publisher->connect(mqtt_client, token, "")) {
         Serial.println("Connected");
        } 
        else {
          Serial.print("Failed, rc=");
          Serial.print(publisher->state());
          Serial.println(" try again in 2 seconds");
          // Wait 2 seconds before retrying
          delay(2000);
        }
      }
    };
    Publisher(PubSubClient pbs){
      publisher = &pbs;
      publisher->setServer(mqtt_server, 1883);
      publisher->setCallback(receive);
    };
}

void connect() {
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
}



WiFiClient node;
PubSubClient publisher(node);//publisher
Publisher device;
void setUp(){
  connect();
  device = new Publisher(publisher);
}

void loop() {
  if(device.reconnect()){
    device.subscribe();
  }
}