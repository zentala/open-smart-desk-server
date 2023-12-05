# Open Smart Desk Server [![stability-experimental](https://img.shields.io/badge/stability-experimental-orange.svg)](https://github.com/emersion/stability-badges#experimental)

## Overview
Make your height-adjustable desk smarter!
Track your time spent sitting and force yourself to stand or take a break. 

Built with RPi, relays, PIR sensor and laser distance meter. 
Should be compatible with any AC-driven standing desk.

Detailed project description with photos and resources: https://desk.zentala.io/

## Project status
In development. 
* Finished hardware controler (v0.1). 
* Server is in the development now.

## Hardware
It was running on [Smart Desk Driver Module v.1](https://github.com/zentala/desk.zentala.io/wiki/Smart-Desk-Driver-Module-v.1)



## Software setup

I am planning to make dockerfile from this steps.

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
* Install [Robo3t](https://robomongo.org/download) for MongoDB mangment
  * On desk local you need to [allow to connect from remote](https://www.digitalocean.com/community/tutorials/how-to-configure-remote-access-for-mongodb-on-ubuntu-20-04); add `desk.local` instead of IP
  * Host: `desk.local`

</details>

