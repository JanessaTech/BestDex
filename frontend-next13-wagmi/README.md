## About this project
This project is a Trade Crypto on Defi Dapp with the Uniswap v3 protocal as the technical fundamental to exchange Crypto token pairs and mine liquidity.

It has the following main features:
1. Swap two token pairs
2. Create/increase/remove liquidity
3. Collect fee

The highlight of the project:
TBD

## How does the Dapp work
Before doing any operations below, make sure that you've had enough tokens in charge
I'll use the testnet **Ethereum Sepolia** as the example to show you how it works
### Login
Click the **Collect Wallet** button on the right top page. A page will pop up with serveral wallets options you can choose from. Here I will use **MetaMask** to login
 ![Login with MetaMask](./demo/login_1.jpg)
A new dialog will pop up after you clicked **MetaMask**, asking you to connect MetaMask
 ![Connect to MetaMask](./demo/login_2.jpg)
Click **Connect** button, you will be asked to verify your account. Click **Confirm** to sign in
 ![Sign-in request](./demo/login_3.jpg)
### Swap two token pairs
Once you logined successfully, choose **Swap** on the menu.
Choose **Sepolia**.  Choose **WETH** for the first token and **USDC** for the second token, input the amount of the first token you want to swap and click **Get Quotes**
![Get Quotes](./demo/swap_1.jpg)
You need to wait for a few seconds for the **Quotes** to be ready
![Quotes is ready](./demo/swap_2.jpg)
Click **Swap** button.
Input the amount of tokens you need to approve for the swapping. The default value provided by default is usually enough. Then click **Approve and swap**
![Inputs for swapping](./demo/swap_3.jpg)


### Add positions(Create liquidity)
### Increase liquidity
### Decrease liquidity
### Collect fee




## Installed dependences

```
npx shadcn@latest init
npm install @uniswap/sdk-core @uniswap/smart-order-router @uniswap/v3-sdk
npm install @rainbow-me/rainbowkit
npm install siwe
npm install lodash.merge
npm i --save-dev @types/lodash.merge
npx shadcn@latest add button
npx shadcn@latest add command
npx shadcn@latest add popover
npx shadcn@latest add sonner
npx shadcn@latest add table
npx shadcn@latest add tabs
npx shadcn@latest add tooltip

```

## How to start

```
npm run dev
npm run build
npm run start
```


## Follwing-up: enhancements
1. Integrate Uniswap Permit2 to enhance user experience
2. Read price from backend - [Done]
3. websocket to monitor pool in backend - [Done]
    - 3.1 check bugs for websockets
    - 3.2 do performance tests
4. Speed up quotes in backend
5. flashbot
6. add logger for frontend - [Done]
7. Add curd for postions - [Done]
8. Refactor tokenList - [Done]
9. fix bugs:
    6.1 exception when create a new position - [Done]
10. Add UTs for frontend and backend
11. using Todo as the keyword to search the places which we should do the enhancements on
12. Move logTransaction to backend (In future, must make sure the websocket service is robust)
13. Add authentication and authorization
14. config channels in backend instead of hardcode
15. merge configuration(UNISWAP_V3_FACTORY_ADDRESSES, V3_SWAP_ROUTER_ADDRESS, NONFUNGIBLE_POSITION_MANAGER_CONTRACT_ADDRESS, chainUrls) with backend and put them into backend
16. Support the native token both for swap and position ops
