# Node falcon

Simple example of how to control an Arduino robot via Node.JS over WiFi

## Requirements

- Arduino robot based
- NodeMCU
- Node.JS
- XBox 360 controller

## Install summary

- Clone this repository `git clone https://github.com/EduardoCavalcanti/node-falcon`
- Install Node.JS dependencies `npm install`
- Flash `./FalconBot/FalconBot.ino` into your Robot (Using Arduino IDE)
- Flash `StandardFirmataWiFi` into your NodeMCU board (see notes below).

## StandardFirmataWiFi

Before flash you will need to configure your WiFi settings and change the following line:

```
Wire.begin();
```
to

```
Wire.begin(D1, D2);
```

Also, you will need to get the board IP. You can define `STATIC_IP_ADDRESS` on `wifiConfig`

## NodeMCU and Arduino connections

| NodeMCU |    Arduino   |
|:-------:|:------------:|
|  GPIO5  | Analog Pin 4 |
|  GPIO4  | Analog Pin 5 |

Also you should provide a power supply for both.

## Run, Forrest, Run!
```
BOARD_IP=<board_ip_goes_here> npm start
```

[Watch the video](https://www.youtube.com/embed/EioouB1gvrk)
