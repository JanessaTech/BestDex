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
## Install libs for jest (unit test) & config
npm install --save-dev jest ts-jest @types/jest
npx ts-jest config:init
In tsconfig.json, for compilerOptions, add:  "types": ["jest"]
In package.json, for scripts, add: "test": "jest"

## Install redis
npm install redis ioredis
npm install @types/redis --save-dev
-- Start redis in docker
  docker-compose -f docker-compose-redis-sentiel.yml up -d
-- Test redis installation:
redis-cli -h 192.168.1.200 -a password
SET runoobkey redis  => OK
get runoobkey   => "redis"
ping  => pong

## Run tests
npm test
```
