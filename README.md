# TradingView alerts processor v2

Minimalist service designed to execute [TradingView](https://www.tradingview.com/) webhooks and process them to Bybit.

### 📦 Installation

```bash
$ npm install
$ npm run start:prod
```

### 🚀 Usage

You can use the bot by interacting with its API. 

- __Add main account__ under the stub `main`
    ```sh
    curl -d '{"stub": "MAIN", "exchange":"bybit", "apiKey": "YOUR_API_KEY", "secret": "YOUR_SECRET_KEY" }' -X POST http://YOUR.STATIC.IP.ADDRESS/accounts -H 'Content-Type: application/json; charset=utf-8'
    ```

- __Open a long position__ of 11$ on MATICUSDT using `main` stub :

    ```sh
    curl -d '{"stub": "main", "symbol": "MATICUSDT", "size": "11", "direction": "long" }' -X POST http://YOUR.STATIC.IP.ADDRESS/trades -H 'Content-Type: application/json; charset=utf-8'
    ```

- __Close 100% of a long position__ on MATICUSDT using `main` stub :

    ```sh
    curl -d '{"stub": "main", "symbol": "ETH-MATICUSDT", "direction": "close" }' -X POST http://YOUR.STATIC.IP.ADDRESS/trades -H 'Content-Type: application/json; charset=utf-8'
    ```
