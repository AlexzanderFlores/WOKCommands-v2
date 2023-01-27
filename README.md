<a href='http://wornoffkeys.com/discord' target='_blank'>![alt Discord](https://img.shields.io/discord/464316540490088448?color=7289da&logo=discord&logoColor=white)</a> <a href='https://github.com/AlexzanderFlores/WOKCommands-v2' target='_blank'>![alt GitHub Repo](https://img.shields.io/github/stars/AlexzanderFlores/WOKCommands?style=social)</a>

<a href='https://nodei.co/npm/wokcommands/' target='_blank'>![alt WOKCommands](https://nodei.co/npm/wokcommands.png)</a>

# WOKCommands with MariaDb nad TypeORM compatibility

WOKCommands is a Discord.JS command handler made by [Worn Off Keys](https://youtube.com/wornoffkeys). The goal of this package is to make it simple and easy to get your bot off the ground without worrying about your own command handler.

# Documentation

The official documentation can be found here: https://docs.wornoffkeys.com

# Installation

You need to just insert this `postinstall` script to your `package.json` (there is for sure better solution for installation, but I don't know how ¯\_(ツ)_/¯)

```json
{
  ...
  "scripts": {
    "postinstall": "cd node_modules/ && git clone git@github.com:kiritodom53/WOKCommands-v2.git wokcommands-dom53 && cd wokcommands-dom53/ && git fetch && git pull && tsc --outDir dist --rootDir src --skipLibCheck && echo \"done\" && exit 0"
  },
  ...
}
```

Then you just need to run this command:
```bash
npm install
```

# Preparation for run

First of all you need to create `.env` file like this:

```dotenv
# Your discord token and etc..

# MariaDB configuration
MARIADB_HOST=192.168.1.2
MARIADB_PORT=2086
MARIADB_USERNAME=username
MARIADB_PASSWORD=password
MARIADB_DATABASE=database

# True is for prduction and false for testing.
# If live is true, than DataSource synchronize is disable and database table will not be create
LIVE=false
```

And that's all. Command handler will create his own DataSource connection.

# Support & Feature Requests

This package is looking for feedback and ideas to help cover more use cases. If you have any ideas feel free to share them within the "💡 ｜ suggestions" channel in the [Worn Off Keys Discord server](http://wornoffkeys.com/discord).

---
