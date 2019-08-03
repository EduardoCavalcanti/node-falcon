const { EtherPortClient } = require('etherport-client');
const { Board } = require('johnny-five');
const gamepad = require('gamepad');

// Controller constants
const CTRL_RT = 5;
const CTRL_LT = 2;
const CTRL_LAX = 0;

// State
let speedLeft = 0;
let speedRight = 0;
let command = 'DF'; // DF | DB
let currentSpeed = 0;
let moveDirectionAxis = 0;

// NodeMCU board
let board = null;

function connect () {
  const port = new EtherPortClient({
    host: '192.168.1.142',
    port: 3030
  });

  board = new Board({
    repl: false,
    port
  });

  board.on('ready', () => {
    console.log('Connected to NodeMCU...');

    board.i2cConfig();

    gamepad.init();
    gamepad.on('move', onAxisMove);

    setInterval(gamepad.processEvents, 16);
    setInterval(gamepad.detectDevices, 500);
    setInterval(loop, 200);
  });
}

function onAxisMove (id, axis, value) {
  if (axis === CTRL_RT || axis === CTRL_LT) {
    // Value is min: 0 max: 2
    value = value + 1;

    // Power percentage
    const power = (value * 100) / 2;

    // Motor speed
    currentSpeed = (power * 255) / 100;

    // Move command
    command = axis === CTRL_RT ? 'DF' : 'DB';
  }

  if (axis === CTRL_LAX) {
    moveDirectionAxis = value;
  }

  if (moveDirectionAxis < 0) {
    // Moving left
    speedLeft = currentSpeed - ((currentSpeed * moveDirectionAxis) * -1);
    speedRight = currentSpeed;
  } else if (moveDirectionAxis > 0) {
    // Moving right
    speedRight = currentSpeed - (currentSpeed * moveDirectionAxis);
    speedLeft = currentSpeed;
  } else {
    speedRight = currentSpeed;
    speedLeft = currentSpeed;
  }

  speedLeft = Math.round((100 * speedLeft) / 255);
  speedRight = Math.round((100 * speedRight) / 255);

  if (speedLeft < 40 && speedLeft !== 0) {
    speedLeft = 40;
  }

  if (speedRight < 40 && speedRight !== 0) {
    speedRight = 40;
  }
}

function loop () {
  const data = {
    c: command,
    l: speedLeft,
    r: speedRight
  };

  board.i2cWrite(0x08, Array.from(JSON.stringify(data), c => c.charCodeAt(0)));
}

if (!process.env.BOARD_IP) {
  console.log('You must set "BOARD_IP"');
  process.exit();
}

connect();
