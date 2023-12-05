# Open Smart Desk Server [![stability-experimental](https://img.shields.io/badge/stability-experimental-orange.svg)](https://github.com/mkenney/software-guides/blob/master/STABILITY-BADGES.md#experimental)


## Key Features
The Open Smart Desk Server (SDS) is an integral module of the Smart Desk ecosystem, equipped with various software components to enhance user experience and promote health-conscious work habits. Key features include:

- **Manual Desk Control:** Direct interaction with the Electronic Driving Control Module for desk height adjustments.
- **Presence and Pose Detection:** Utilizes sensors to track user activities, forming user phisical activity timeline.
- **Smart Logic for Health:** Intelligent algorithms produces personalized recommendations of breaks and posture change suggestions.
- **User Engagement and Gamification:** The User Web Application (UWA) features a point-based system to motivate users to adopt healthier routines.
- **Configurable Semi-Automated Routines:** Allows users to set up customized rulesets for semi-automated desk control, enhancing the overall experience.


## 🧩 Smart Desk Modular System Vision
The SDS (Smart Desk Server) is a central software module of the Smart Desk Modular System, integrating various software components and ensuring seamless communication with hardware modules:

### 🔩 Hardware Modules
- **Electronic Driving Control Module:** Controls the desk's physical movements.
- **Physical Control Panel (PCP):** Provides a user interface for desk interaction.
- **Presence and Pose Detection (PPD):** Employs sensors for tracking user activities.

### 💻 Software Components Integrated in Smart Desk Server (SDS)
- **Admin Web Interface (AWI):** For configuring hardware modules and setting semi-automatic actions.
- **User Web Application (UWA):** Interactive platform providing health tips, data visualization, and gamification.
- **Sensor Data Analyzer (SDA):** Analyzes sensor data for user activity insights and health recommendations.

### External Software Components
- **MQTT Broker:** Enables communication between ecosystem modules. Can be installed either directly on the server or hosted externally.

The Smart Desk Server is designed to be a versatile and independent unit that can be installed locally on an RPi under the desk, on a local NAS server, or installed other already-in-use server eg. Home Assistant. It communicates exclusively with the hardware modules, focusing on providing user health-oriented experience and features.

## Hardware Requirements Status

The SDS project initially utilized the [Smart Desk Driving-Control Module v1](https://github.com/zentala/desk.zentala.io/wiki/Driving-Control-Module-v1). Further iterations have led to a vision for a more advanced and reliable [modular system architecture](https://github.com/zentala/desk.zentala.io/wiki#-smart-desk-modular-system-vision), which currently is not fully designed and is not available for construction or purchase.

### Project Note
SDS is a DIY project in a state of sporadic updates. The journey from concept to commercialization is long and complex. The existing hardware, while functional, is not recommended for replication due to its prototype nature and design flaws. Lessons learned are detailed in [Physical Control Panel v1](https://github.com/zentala/desk.zentala.io/wiki/Physical-Control-Panel-v1) and [Driving Control Module v1](https://github.com/zentala/desk.zentala.io/wiki/Driving-Control-Module-v1). The aim is to develop a new version of the hardware based on the modular architecture. In parallel, the software vision involves creating a Dockerized, ready-to-use modular component.


## Project Status
- **Current Phase:** Early Development
- **Project Overview:** The project is in its vision phase, with a primary focus on developing a web interface for desk movement control. It's important to note that the features are in the early stages of development.

### Progress
  - Hardware controller (v0.1) - Completed (Not recommended for replication due to design flaws)
  - New Hardware Development - In Planning (See [Modular Architecture](https://github.com/zentala/desk.zentala.io/wiki/Modular-Architecture) for vision)
  - Server Development - Ongoing
  - Sensor Integration - In Progress
    - Transitioning from PIR to microwave sensors due to test failures.

### Collaboration Call
We are looking for investors, data scientists, passionate electricians or hardware enthusiasts to collaborate on this exciting project. For more information on collaboration and potential profitability, please visit our [Business Strategy](https://github.com/zentala/desk.zentala.io/wiki/Business-Strategy-&-Collaboration).


## Technological stack
| Category    | Technology  |
| :---------- | :---------- |
| Environment | ![Linux](https://img.shields.io/badge/-Linux-FCC624?logo=linux&logoColor=black) &nbsp; ![Raspberry Pi](https://img.shields.io/badge/-RaspberryPi-A22846?logo=raspberrypi&logoColor=white) |
| Backend     | ![Node.js](https://img.shields.io/badge/-Node.js-339933?logo=nodedotjs&logoColor=white) &nbsp; ![npm](https://img.shields.io/badge/-npm-CB3837?logo=npm&logoColor=white) &nbsp; ![JavaScript](https://img.shields.io/badge/-JavaScript-F7DF1E?logo=javascript&logoColor=black)|
| Front-end   | ![HTML5](https://img.shields.io/badge/-HTML5-E34F26?logo=html5&logoColor=white) &nbsp; ![CSS3](https://img.shields.io/badge/-CSS3-1572B6?logo=css3&logoColor=white) &nbsp; ![JavaScript](https://img.shields.io/badge/-JavaScript-F7DF1E?logo=javascript&logoColor=black) |
| Code Quality | ![EditorConfig](https://img.shields.io/badge/-EditorConfig-FEFEFE?logo=editorconfig&logoColor=black) |


## Software Setup

To deploy the Smart Desk Server on your microcomputer and set up remote development with VSCode, follow these steps:

<details>
<summary>Linux on RPi & Server Setup</summary>

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
* Install [nvm](https://github.com/nvm-sh/nvm)
   ``` bash
   $ curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.37.2/install.sh | bash
   ```
* [Install MongoDB](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-ubuntu/) 4.4.4, and hold packages and start deamon:
   ``` bash
   $ wget -qO - https://www.mongodb.org/static/pgp/server-4.4.asc | sudo apt-key add -
   $ echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/4.4 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-4.4.list
   $ sudo apt-get update
   $ sudo apt-get install -y mongodb-org=4.4.4 mongodb-org-server=4.4.4 mongodb-org-shell=4.4.4 mongodb-org-mongos=4.4.4 mongodb-org-tools=4.4.4
   $ echo "mongodb-org hold" | sudo dpkg --set-selections
   $ echo "mongodb-org-server hold" | sudo dpkg --set-selections
   $ echo "mongodb-org-shell hold" | sudo dpkg --set-selections
   $ echo "mongodb-org-mongos hold" | sudo dpkg --set-selections
   $ echo "mongodb-org-tools hold" | sudo dpkg --set-selections
   $ sudo systemctl enable mongod.service
   ```
* Awesome console:
   ```bash
   $ sh -c "$(curl -fsSL https://raw.github.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
   $ rm ~/.zshrc
   $ ln -s ~/open-smart-desk/conf/home/ubuntu/.zshrc ~/.zshrc
   ```
* Restart RPi to apply above changes:
  ``` bash
  $ sudo shutdown -r now
  ```

</details>

<details>
<summary>Development from remote desktop</summary>
  
We are gonna setup you desktop to easlily work with the code on the remote RPi. That will be very usefull if you want to develop project code. 
  
Kindly notice: **Bellow comands and instructions should be executed on your desktop (not RPi!).** 

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
* Install [Robo3t](https://robomongo.org/download) for MongoDB mangment
  * On desk local you need to [allow to connect from remote](https://www.digitalocean.com/community/tutorials/how-to-configure-remote-access-for-mongodb-on-ubuntu-20-04); add `desk.local` instead of IP
  * Host: `desk.local`

</details>

