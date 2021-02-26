from flask import Flask, request, jsonify
import RPi.GPIO as GPIO

# Relay switch setup
Relay = [26, 20, 21]
global Relay1,Relay2,Relay3
Relay1 = 1
Relay2 = 1
Relay3 = 1

# GPIO.setwarnings(False) # disable GPIO warning
GPIO.cleanup() # clean up all GPIO pins, refactor on exit
GPIO.setmode(GPIO.BCM) # Broadcom pin-numbering scheme

for i in range(3):
  GPIO.setup(Relay[i], GPIO.OUT)
  GPIO.output(Relay[i], GPIO.HIGH)


# HTTP server setup
app = Flask(__name__)

print("test")
app = Flask(
  __name__,
  static_url_path="",
  static_folder="../client/"
)

@app.route("/")
def root():
  return app.send_static_file('index.html')

@app.route('/relay', methods = ['GET', 'POST'])
def Relay_Control():
  if request.method == 'POST':
    global Relay1,Relay2,Relay3
    content = request.json
    Relay1 = content['Relay1']
    Relay2 = content['Relay2']
    Relay3 = content['Relay3']

    GPIO.output(Relay[0], int(Relay1))
    GPIO.output(Relay[1], int(Relay2))
    GPIO.output(Relay[2], int(Relay3))

    relays_status = {
        'r1': Relay1,
        'r2': Relay2,
        'r3': Relay3
    }

    return jsonify(code=200, relays=relays_status), 200

if __name__ == "__main__":
  app.run(host="127.0.0.1", port=8080)
