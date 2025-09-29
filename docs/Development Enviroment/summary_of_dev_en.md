---
layout: default
title: Summary Of Development Enviroment
excerpt: Short description to include as an opening and SEO metatags.
nav_order: 2
nav_exclude: false
search_exclude: false
---
# Summary of the Development Environment

This document explains all aspects related to the existing development environment

## What happened to AWS?

After a recent meeting with our Client, a decision has been made to move away from AWS, likely due to budgetary concerns. However, that doesn't change all major aspects of our project's code base as it was designed to work with Docker, and as thus, be portable onto any device.

### What's Changed?

Fundamentally, nothing has changed. The codebase is almost the exact same same, with some minor changes needed to account for relying on the different architecture.

Mainly this comes with the addition of an Environment variable

```
ADDRESS="%insertvariablevalue%"
```

This variable functions as the static web address that the site uses for many of its systems, including but not limited to:

This line in the `docker-compose.yml`
```
wp core --path='/var/www/html' multisite-install --url=${ADDRESS}:8000 --title="blueprint" --admin_user=${WORDPRESS_DATABASE_USER} --admin_password=${WORDPRESS_DATABASE_PASSWORD} --admin_email=foo@bar.com;
```
specifically the `--url=${ADDRESS}:8000` part, which denotes the static address used for the wordpress backend.

Alongside that, its also use to make any backend API calls, with this endpoint:
`http://{ADDRESS}:8000/wp-json/wp/v2` 

## Current Architecture

The current architecture of the development environment is as such:

```
System:
  Host: nevara-ROG-Zephyrus-G14-GA401IV-GA401IV Kernel: 6.14.0-32-generic arch: x86_64 bits: 64
  Console: pty pts/2 Distro: Ubuntu 24.04.3 LTS (Noble Numbat)
Machine:
  Type: Laptop System: ASUSTeK product: ROG Zephyrus G14 GA401IV_GA401IV v: 1.0
    serial: <superuser required>
  Mobo: ASUSTeK model: GA401IV v: 1.0 serial: <superuser required> UEFI: American Megatrends
    v: GA401IV.222 date: 09/28/2023
Battery:
  ID-1: BAT0 charge: 59.8 Wh (100.0%) condition: 59.8/76.0 Wh (78.6%) volts: 15.8 min: 15.8
CPU:
  Info: 8-core model: AMD Ryzen 9 4900HS with Radeon Graphics bits: 64 type: MT MCP cache:
    L2: 4 MiB
  Speed (MHz): avg: 1503 min/max: 1400/3000 cores: 1: 1397 2: 1400 3: 1400 4: 1400 5: 1397
    6: 1468 7: 1400 8: 3000 9: 1397 10: 1400 11: 1397 12: 1398 13: 1397 14: 1400 15: 1397 16: 1400
Graphics:
  Device-1: NVIDIA TU106M [GeForce RTX 2060 Max-Q] driver: N/A
  Device-2: AMD Renoir [Radeon RX Vega 6 ] driver: amdgpu v: kernel
  Display: server: X.org v: 1.21.1.11 with: Xwayland v: 23.2.6 driver: X: loaded: amdgpu,nvidia
    unloaded: fbdev,modesetting,nouveau,radeon,vesa dri: radeonsi gpu: amdgpu tty: 237x63
    resolution: 1920x1080
  API: EGL v: 1.5 drivers: kms_swrast,radeonsi,swrast platforms: gbm,wayland,surfaceless,device
  API: OpenGL v: 4.6 compat-v: 4.5 vendor: mesa v: 24.2.8-1ubuntu1~24.04.1
    note: console (EGL sourced) renderer: llvmpipe (LLVM 19.1.1 256 bits), AMD Radeon Graphics
    (radeonsi renoir LLVM 19.1.1 DRM 3.61 6.14.0-32-generic)
Audio:
  Device-1: NVIDIA TU106 High Definition Audio driver: snd_hda_intel
  Device-2: AMD Renoir Radeon High Definition Audio driver: snd_hda_intel
  Device-3: AMD ACP/ACP3X/ACP6x Audio Coprocessor driver: N/A
  Device-4: AMD Family 17h/19h HD Audio driver: snd_hda_intel
  API: ALSA v: k6.14.0-32-generic status: kernel-api
  Server-1: PipeWire v: 1.0.5 status: active
Network:
  Device-1: Intel Wi-Fi 6 AX200 driver: iwlwifi
  IF: wlp2s0 state: up mac: a8:7e:ea:77:13:84
  IF-ID-1: docker0 state: down mac: 2a:8a:d6:e8:8c:e3
  IF-ID-2: tailscale0 state: unknown speed: -1 duplex: full mac: N/A
Bluetooth:
  Device-1: Intel AX200 Bluetooth driver: btusb type: USB
  Report: hciconfig ID: hci0 state: up address: A8:7E:EA:77:13:88 bt-v: 5.2
Drives:
  Local Storage: total: 953.87 GiB used: 25.4 GiB (2.7%)
  ID-1: /dev/nvme0n1 vendor: Intel model: SSDPEKNW010T8 size: 953.87 GiB
Partition:
  ID-1: / size: 936.79 GiB used: 25.39 GiB (2.7%) fs: ext4 dev: /dev/nvme0n1p2
  ID-2: /boot/efi size: 1.05 GiB used: 6.1 MiB (0.6%) fs: vfat dev: /dev/nvme0n1p1
Swap:
  ID-1: swap-1 type: file size: 4 GiB used: 512 KiB (0.0%) file: /swap.img
Sensors:
  System Temperatures: cpu: N/A mobo: N/A gpu: amdgpu temp: 60.0 C
  Fan Speeds (rpm): cpu: 5000
Info:
  Memory: total: 16 GiB note: est. available: 15.04 GiB used: 1.7 GiB (11.3%)
  Processes: 368 Uptime: 7h 8m Init: systemd target: graphical (5) Shell: Bash inxi: 3.3.34
```

However, because this project runs in Docker Containers, the specs required to run this project are much more minimal:

*Estimated Minimum Specs*
- 32 GB Storage
- 4 Core Processor
- 16 GB RAM

### Accessing the current dev environment

Please reach out to connerchilders@csus.edu to get added to the Tailnet, or reach out to me on discord `bling6906`

## How to setup your own Dev Environment

Requirements:
- **Docker** must be installed
	- **Node** is recommended to be installed, although not needed
- `tmux` must be installed to run the start scripts
- Use some kind of web access service
	- This is needed so your server can talk to the internet
	- Recommended are **Cloudflare** and any other provider
- Have a static address that you can use for internet traffic

### Setting up the server

Step 1. Clone the github repo https://github.com/conner-chil32/Blueprint

Step 2. Inside the `Blueprint` folder, you must create a `.env` file

Step 3. Set the environment variables inside the `.env` file
- They are as follows
	- `CONTAINER_NAME` this will be shared name of all your container process
	- `ADDRESS` this will be used as the address for which backend calls will be made
		- This should match your static address you acquire to host the website
	- `DATABASE_NAME` this is the name of the web app's database
	- `DATABASE_USER` this is the name of the web app database's primary user (**NOT ROOT**)
	- `DATABASE_PASSWORD` this is the web app database's primary user password
	- `DATABASE_ROOT_PASSWORD`this is the web app database's **root** user password
		- There is a difference here because one possess full controls over the database, and another is used to `phpmyadmin` can access the database
	- `WORDPRESS_DATABASE_NAME` this is the name of the wordpress backend database
	- `WORDPRESS_DATABASE_USER` this is the name of the wordpress backend database's primary user
	- `WORDPRESS_DATABASE_PASSWORD` this is the password for the wordpress backend database's primary user
	- `WORDPRESS_DATABASE_ROOT_PASSWORD`  this is the password for the wordpress backend database's **root** user
		- Same reason why the web app has two users/password

Step 4. Run the `start.sh` shell script with `./start.sh`
	If you do not have `root` permissions on Linux, you must `sudo` to perform this operation

Step 5. Let the setup finish
	You are building the docker images for the first time, this may take a while.

If you see this line, the webserver and all its services are now running:
```
SETUP DONE!
```

### Gracefully Shutting down

If you have run either the `coldstart.sh` or `start.sh` files, then you will be placed into a `tmux` window. **DO NOT PANIC**, Follow these steps to gracefully shutdown.

Step 1. Press the keys `Ctrl-B` to enter command mode.

Step 2. Then use the left arrow key to go to the second pane.

Step 3. Run the `shutdown.sh` file using the same method as `start.sh`

Step 4. Enter the command `tmux kill-server`, this takes you back to your normal terminal window

You can then re-run the server with the `start.sh` command, however if you make any major change to the system, it is recommended you run the `cleanup.sh` or `coldstart.sh` file to remove any existing configurations.

**NOTE**
*If you run the `cleanup.sh` or `coldstart.sh` it will delete the database data currently, this will be addressed at a later date -Conner*

