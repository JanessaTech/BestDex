## How to install

```
npm install
```

## How to start app

```
npm run build
npm run ts-start-local
npm run ts-start-testnet
npm run ts-start-mainnet
npm run start
```

## How to install libs & config for test and run tests
```
## Install libs & config
npm install --save-dev jest ts-jest @types/jest
npx ts-jest config:init
In tsconfig.json, for compilerOptions, add:  "types": ["jest"]
In package.json, for scripts, add: "test": "jest"

## Run tests
npm test
```
