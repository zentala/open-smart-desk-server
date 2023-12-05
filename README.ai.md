# Open Smart Desk Server

## Overview
Open Smart Desk Server transforms your height-adjustable desk into a smart workstation. This guide focuses on the technical setup of the server software, step-by-step.

## Project Status
- **Hardware**: Completed Smart Desk Driver Module v0.1.
- **Server**: Currently in development.

## Hardware Requirements
Previously operated on [Smart Desk Driver Module v.1](https://github.com/zentala/desk.zentala.io/wiki/Smart-Desk-Driver-Module-v.1).

## Raspberry Pi Setup
### Preparing the Raspberry Pi
- Flash Ubuntu Server 20.04 onto an SD card and configure WiFi. Instructions [here](https://roboticsbackend.com/install-ubuntu-on-raspberry-pi-without-monitor/).
- Clone this repository into the user's home directory.
- Enable [passwordless sudo](https://phpraxis.wordpress.com/2016/09/27/enable-sudo-without-password-in-ubuntudebian/).

### Network and Hostname Configuration
- Install `avahi` for network discovery:
  ```bash
  sudo apt-get install avahi-daemon avahi-discover avahi-utils libnss-mdns mdns-scan --yes
  sudo vim /etc/hostname
  ```

-   Your Raspberry Pi will be accessible in the network as `desk.local`.

### GPIO and I2C Access

-   Grant non-sudo user access to GPIOs and I2Cs:
    
    ```
    bashCopy codesudo usermod -G dialout "$USER"
    sudo addgroup i2c
    sudo usermod -G i2c "$USER"
    sudo ln -s ~/open-smart-desk/conf/lib/udev/rules.d/60-i2c-tools.rules /lib/udev/rules.d/60-i2c-tools.rules
    
    ```
    

### Setting Up Nginx Proxy

-   Install and configure nginx:
    
    ```
    bashCopy codesudo apt-get install nginx uwsgi --yes
    sudo rm /etc/nginx/sites-enabled/default
    sudo ln -s ~/open-smart-desk/conf/etc/nginx/sites-enabled/default /etc/nginx/sites-enabled/default
    sudo systemctl reload nginx
    
    ```
    

### Installing nvm and MongoDB

-   Install [nvm](https://github.com/nvm-sh/nvm):
    
    ```
    bashCopy codecurl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.37.2/install.sh | bash
    
    ```
    
-   Install MongoDB 4.4.4:
    
    ```
    bashCopy code# MongoDB installation commands...
    
    ```
    
-   Enable and start MongoDB daemon.

### Awesome Console Setup

-   Install Oh My Zsh:
    
    ```
    bashCopy codesh -c "$(curl -fsSL https://raw.github.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
    rm ~/.zshrc
    ln -s ~/open-smart-desk/conf/home/ubuntu/.zshrc ~/.zshrc
    
    ```
    
-   Restart Raspberry Pi to apply changes.

## Project Setup

-   Install dependencies with poetry:
    
    ```
    bashCopy codecd ~/open-smart-desk/
    poetry install 
    
    ```
    

## Remote Development Setup

### Easy SSH Access

-   Set up SSH keys and access on your desktop:
    
    ```
    bashCopy code# SSH setup commands...
    
    ```
    
-   Add to `~/.ssh/config` for easier access.

### Remote Development with VSCode via SSH

-   Install [Microsoft Visual Studio Code](https://code.visualstudio.com/download).
-   Use [Remote Development](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.vscode-remote-extensionpack) extension for remote work.
-   Follow [remote SSH instructions](https://code.visualstudio.com/docs/remote/ssh).
-   Install [Robo3t](https://robomongo.org/download) for GUI MongoDB management.

# About

For more details, visit the project's main page: [Open Smart Desk](https://desk.zentala.io/).
