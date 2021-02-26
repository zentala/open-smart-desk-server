from flask import Flask, render_template, jsonify, request
from flask_socketio import SocketIO, send, emit
import RPi.GPIO as GPIO



# -----------------------------------------------
# Relay switch setup ----------------------------

relay_gpio_pin = [26, 20, 21] # relay board pins, from 1st to 3rd relay

relay_direction_states = {
  "stop": [1,1,1],
  "up": [1,0,0],
  "down": [0,0,0]
}

# GPIO.setwarnings(False) # disable GPIO warning
GPIO.cleanup() # clean up all GPIO pins, refactor on exit
GPIO.setmode(GPIO.BCM) # Broadcom pin-numbering scheme

for index, pin in enumerate(relay_gpio_pin):
  print("Initalizing relay no.{} on pin no.{}...".format(index, pin))
  GPIO.setup(pin, GPIO.OUT)
  GPIO.output(pin, GPIO.HIGH)

def relays_switch(direction):
  states = relay_direction_states.get(direction)
  for index, state in enumerate(states):
    GPIO.output(relay_gpio_pin[index], int(state))



# -----------------------------------------------
# HTTP server setup -----------------------------

app = Flask(
  __name__,
  static_url_path="",
  static_folder="../client/"
)

@app.route("/")
def root():
  return app.send_static_file("index.html")



# -----------------------------------------------
# Socket.io server ------------------------------

socketio = SocketIO(app, cors_allowed_origins="*")

@socketio.on('motor')
def motor(direction):
  relays_switch(direction)

@socketio.on('message')
def handle_message(data):
    print('received message: ' + data)

@socketio.on('json')
def handle_json(json):
    print('received json: ' + str(json))


# @socketio.on('my_event')
# def handle_my_custom_event(arg1, arg2, arg3):
#     print('received args: ' + arg1 + arg2 + arg3)

# @socketio.on('message')
# def handle_message(message):
#     send(message)

# @socketio.on('json')
# def handle_json(json):
#     send(json, json=True)

# @socketio.on('my event')
# def handle_my_custom_event(json):
#     emit('my response', json)



# -----------------------------------------------
# Start application -----------------------------

if __name__ == '__main__':
  socketio.run(app, port="8080", host="localhost")
