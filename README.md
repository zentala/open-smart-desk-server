# Open Smart Desk

## Overview
Make your height-adjustable desk smarter!
Track your time spent sitting and force yourself to stand or take a break. 

Built with RPi, relays, PIR sensor and laser distance meter. 
Should be compatible with any AC-driven standing desk.

## Project status
In development. 
* Finished hardware controler (v0.1). 
* Server is in the development now.

## Hardware
Note: **I don't recommend to build it as it is, because of a few known issues.**

### Known issues
* Plexi enclousore makes hardware almost not possible to access
* No mounting for the PIR sensor
* We can reduce costs replacing oversized components:
  * RPi4B with RPi zero 
  * 5V power supply 6A with 2A

### Parts list
* [Raspbery Pi 4 model B (4GB)](https://www.raspberrypi.org/products/raspberry-pi-4-model-b/?variant=raspberry-pi-4-model-b-4gb)
* [Waveshare RPi Relay Board (11638)](https://www.waveshare.com/rpi-relay-board.htm)
* [Laser metter VL53L0X](https://www.amazon.com/Gowoops-VL53L0X-Breakout-GY-VL53L0XV2-Distance/dp/B07F3RH7TC/)
* [Motion sensor PIR HC-SR501](https://components101.com/hc-sr501-pir-sensor)
* [Power supply EPS-35-5 (5V, 6A)](https://www.reichelt.com/pl/en/power-supply-5-v-6-a-eps-35-5-p170940.html)
* [SP2112/S4 female panel socket](https://www.tme.eu/pl/en/details/sp2112_s4/weipu-connectors/weipu/)
* [SP2110/P4II male plug](https://www.tme.eu/pl/en/details/sp2110_p4/weipu-connectors/weipu/sp2110-p4-ii-1n/)
* [4x low nut M3 (black, oxidized, 3mm height)](https://allegro.pl/oferta/nakretka-nakretki-niska-czarna-oksyda-m3-10szt-6904944393)
* [6x spherical screw M3x8 (black, hex socket)](https://allegro.pl/oferta/sruba-kulista-czarna-m3x8-gniazdo-imbus-10szt-5315915867)
* C14 male panel socket
* C13 female cable (regular PC power cable) 
* microSD card 32GB
* plexi laser cutted enclousre 

## RPi Setup (required)
* Follow instruction to [flash SD card with Ubuntu Serwer 20.04 and configure WiFi without monitor](https://roboticsbackend.com/install-ubuntu-on-raspberry-pi-without-monitor/)
* Clone this repo to the user home directory
* Setup [passwordless sudo](https://phpraxis.wordpress.com/2016/09/27/enable-sudo-without-password-in-ubuntudebian/)
* Install `avahi` and change hostname, so your RPi will be avaliable in the network as `desk.local` with mDNS:
``` bash
$ sudo apt-get install avahi-daemon avahi-discover avahi-utils libnss-mdns mdns-scan --yes
$ sudo vim /etc/hostname 
```
* Give user non-sudo access to GPIOs and I2Cs devices:
``` bash
$ sudo usermod -G dialout "$USER"
$ sudo addgroup i2c
$ sudo usermod -G i2c "$USER"
$ sudo ln -s \
  ~/open-smart-desk/conf/lib/udev/rules.d/60-i2c-tools.rules \
  /lib/udev/rules.d/60-i2c-tools.rules
```
* Setup `nginx` proxy:
``` bash
$ sudo apt-get install nginx uwsgi --yes
$ sudo rm /etc/nginx/sites-enabled/default
$ sudo ln -s \
  ~/open-smart-desk/conf/etc/nginx/sites-enabled/default \
  /etc/nginx/sites-enabled/default
$ sudo systemctl reload nginx
```
* Install [Poetry](https://python-poetry.org/docs/) for 
``` bash
$ curl -sSL https://raw.githubusercontent.com/python-poetry/poetry/master/get-poetry.py | python -
```
* Restart RPi to apply above changes:
``` bash
$ sudo shutdown -r now
```


## Development setup on remote desktop
We are gonna setup you desktop to easlily work with the code on the remote RPi. That will be very usefull if you want to develop project code. **Bellow comands and instructions should be executed on your desktop (not RPi!).** 

### Easy SSH access
Execute on your desktop:
``` bash
$ ssh-keygen -t rsa # if not generated yet
$ ssh ubuntu@desk.local mkdir -p .ssh
$ cat .ssh/id_rsa.pub | ssh ubuntu@desk.local 'cat >> .ssh/authorized_keys'
```
Add to your `~/.ssh/config`:
``` ssh-config
# RPi for Desk.local
Host desk.local
  Hostname desk.local
  User ubuntu
  IdentityFile ~/.ssh/id_rsa
```
Now you can connect with your RPi with simple:
``` bash
$ ssh desk.local
```
Try it.

### Remote Development with VSCode via SSH
* Install [Microsoft Visual Studio Code](https://code.visualstudio.com/download)
* Install [Remote Development](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.vscode-remote-extensionpack) extension pack
* Read [detailed remote SSH instruction development](https://code.visualstudio.com/docs/remote/ssh) if neeed
* Open remote repository with remote development plugin
* Allow VSCode to install recommened plugins

