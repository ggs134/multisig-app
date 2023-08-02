# Multisig Interface for ownable-multisig

https://github.com/ggs134/ownable-multisig

## Install

```shell
#Install python flask
virtualenv .venv
. .venv/bin/activate
(.venv) pip install -r requirements.txt

#Install webpack, ethers.js and build
npm install --save
npm run build

```

## Setting before build
- Change const variables in static/index.js 
```shell
const TON_ADDRESS = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
const USDT_ADDRESS = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
const USDC_ADDRESS = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
const MULTISIG_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

const NETWOROK_URL = "http://127.0.0.1:8545/";
const NETWORK_ID = "31337";
```
## Run server
```shell
flask --app hello run --debug
```