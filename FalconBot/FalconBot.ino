#include <Wire.h>
#include <ArduinoJson.h>
#include <FalconRobot.h>

FalconRobotMotors motors(5, 7, 6, 8);

int leftSpeed = 0;
int rightSpeed = 0;
int driveDirection = FORWARD;

void setup() {
  Serial.begin(9600);
  
  Wire.begin(8);
  Wire.onReceive(onReceiveEvent);
}

void loop() {
  motors.leftDrive(leftSpeed, driveDirection);
  motors.rightDrive(rightSpeed, driveDirection);
}

void onReceiveEvent (int bytes) {
  String incoming;
  
  while (Wire.available()) {
    incoming += (char)Wire.read();
  }

  StaticJsonDocument<256> doc;
  deserializeJson(doc, incoming);
  
  Serial.print("Received: ");
  serializeJson(doc, Serial);
  Serial.println();
  
  if (doc.containsKey("c")) {
    if (doc["c"] == "DF") {
      driveDirection = FORWARD;
      leftSpeed = doc.containsKey("l") ? doc["l"] : 0;
      rightSpeed = doc.containsKey("r") ? doc["r"] : 0;
    }

    if (doc["c"] == "DB") {
      driveDirection = BACKWARD;
      leftSpeed = doc.containsKey("l") ? doc["l"] : 0;
      rightSpeed = doc.containsKey("r") ? doc["r"] : 0;
    }
  }
}
