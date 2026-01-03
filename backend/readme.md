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
npm run codegen // if you just need to generate the graphclient
npm run dev // if you need to run/debug graphclient query locally
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
redis-cli -h 192.168.0.200 -a password
SET runoobkey redis  => OK
get runoobkey   => "redis"
ping  => pong

docker update --restart=always 8ffba59c3f60 3d4d27283b67

## Run tests
npm test
```

## Enhancements
1. using separate logger instead of only one log file
2. refactor hardcode.ts
3. Unify the config files, .env , constants.ts and hardcode.ts
