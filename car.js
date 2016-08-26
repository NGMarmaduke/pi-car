const rpio = require('rpio');

const MOTOR1A = 16;
const MOTOR1B = 18;
const MOTOR1E = 22;

const MOTOR2A = 11;
const MOTOR2B = 13;
const MOTOR2E = 15;

const Motor = class Motor {
  constructor(aPin, bPin, enablePin) {
    this.aPin = aPin;
    this.bPin = bPin;
    this.enablePin = enablePin;

    rpio.open(this.aPin, rpio.OUTPUT, rpio.LOW);
    rpio.open(this.bPin, rpio.OUTPUT, rpio.LOW);
    rpio.open(this.enablePin, rpio.OUTPUT, rpio.LOW);
  }

  forward() {
    rpio.write(this.aPin, rpio.HIGH);
    rpio.write(this.bPin, rpio.LOW);
    this.start();
  }

  reverse() {
    rpio.write(this.aPin, rpio.LOW);
    rpio.write(this.bPin, rpio.HIGH);
    this.start();
  }

  start() {
    rpio.write(this.enablePin, rpio.HIGH);
  }

  stop() {
    rpio.write(this.enablePin, rpio.LOW);
  }

  closeGpio() {
    rpio.close(this.aPin);
    rpio.close(this.bPin);
    rpio.close(this.enablePin);
  }
};

const rightMotor = new Motor(MOTOR1A, MOTOR1B, MOTOR1E);
const leftMotor = new Motor(MOTOR2A, MOTOR2B, MOTOR2E);

function forward() {
  leftMotor.forward();
  rightMotor.forward();
}

function reverse() {
  leftMotor.reverse();
  rightMotor.reverse();
}

function left() {
  leftMotor.reverse();
  rightMotor.forward();
}

function right() {
  leftMotor.forward();
  rightMotor.reverse();
}

function stop() {
  leftMotor.stop();
  rightMotor.stop();
}

function tearDown() {
  leftMotor.closeGpio();
  rightMotor.closeGpio();
}

function printStatus(pin) {
  console.log(`Pin ${ pin } is currently set ` + (rpio.read(pin) ? 'high' : 'low'));
}

function pinStatus() {
  console.log('========================');
  printStatus(MOTOR1A);
  printStatus(MOTOR1B);
  printStatus(MOTOR1E);
  console.log('========================');
  printStatus(MOTOR2A);
  printStatus(MOTOR2B);
  printStatus(MOTOR2E);
  console.log('========================');
}

exports.forward = forward;
exports.reverse = reverse;
exports.left = left;
exports.right = right;
exports.stop = stop;
exports.pinStatus = pinStatus;
exports.tearDown = tearDown;
