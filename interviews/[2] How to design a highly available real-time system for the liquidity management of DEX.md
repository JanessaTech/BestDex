**[Interviewer]** In order to design a highly available & real-time data service used to get UniswapV3Pool states, please describe:
1. The most critical real-time data: when user opens the liquidity management page
2. The source of data updating : which events trigger the updating?

**[Me]**. 1. The most critical real-time data: ***liquidity, tick and sqrtPriceX96***. They are critical to render the liquidity management page
2. Swap, Mint, Burn and DecreaseLiquidity(defined In NonfungiblePositionManager)

**[Interviewer]** Good. You hit the core of DeFi integration: monitor the events on the chain and synchronzie the states from the on-chain to the off-chain. Let's start the design. Our aim is to evolve the design into a "highly available real-time data service"
My first question is: you mentioned you update pool states when one of events swap, Mint, Burn and DecreaseLiquidity is detected. The swap event is the most frequent one. Suppose there are thousands of swaps per second from different pools, how do design your monitor so that there is no event missing, no delay and it can quickly recover from faults?

**[Me]** I will design a distributed, message queue-based stream processing architecture. I will explain it from 3 aspects: event monitor, processing and health monitor& fault recovery :
- **event monitor**:
    Design a monitor cluster with multiple monitor instances. Each instance is connected to a connection pool which manages multiple rpc providers or self-built nodes
    each monitor instance is partitioned according to the pool address, which could make sure all events belonging to the same pool are processed sequentially
    Once a new event is received by one monitor instance, it is sent to the message queue in the downstream.
    To make sure no missing events, implement ***Exactly-Once processing semantics***: on the event monitor side, use ***block number + transaction index + log index*** as the cursor and save it to database periodically 

- **processing**:
    There are multiple processing consumers to process messages from the message queue. The processed results are saved to redis to check the latest pool data and database for the history records.
    To finish Exactly-Once processing semantics, on the processing side, send the confirmation after one message is proccessed, combined with database transaction. For the recovery, we save the message offset to database.

- **health monitor& fault recovery**:
    - **health monitor**:
        - **delay monitoring**: Set up delay metrics across different processing stage of an event: on chain -> being detected, being in queue, being processed
        - **backlog monitoring**: Monitor the lag situation of each message
        - **health check**: Monitor healthy status of each instance
    - **fault recovery**:
        Using the heart beat mechanism to detect the failure of monitor instance and processing consumer.
        If one processing consumer crushed, start a new one and consume the message from the offset which is already saved in database
        If one monitor instance crushed, switch to the backup monitor instance, start the scanning from the cursor which is already saved in database

**[Interviewer]** Execellent! your design demonstrates the thinking from a mature backend architect. I want you to integrate this real time data service with the previous Swap quotes service to form a united backend DEX architecture. Let's talk about how to start the integration:
1. **Share and reuse**
    In this design, the real time data service will update the pool data into redis and database while the Swap quotes service also needs to read the pool data to calculate route path.
    Cache sharing: Is it possible to let the two services to share the same redis
    Data format: What's the data format if it is possible to share the redis?
2. **The united data consumption and pushing**
    Now we have the real time service to monitor events on the chain and update  data on the off chain accordingly. Meanwhile, the frontend needs the updates to render page. I want to know how you expose the updates from the real time data service to the frontend, better as timely as possible?

**[Me]** Let me talk about them one by one. First, let's take a look at "Share and reuse". Actually, before diving into the discussion about it, I need to clarify that the current Swap quotes service is a little different from your understanding.
Currently, the swap quotes service will call the AlphaRouter running in backend. I believe, inside AlphaRouter, it definitly needs to access to the latest pool data. But I haven't yet found any interface or params I could use to pass the outside pool data to it. In another words, Swap quotes service works in a black box without any data channel sitting bewteen two services

**[Interviewer]** OK. Thanks for your clarification. The aim of our design becomes clearer now: under the precondition of AlphaRouter working as a blackbox, how do you design a system which could provide an united data service used for both Swap quotes service and liquidity management service? and how do you share the data/updates to frontend in a timely way?

**[Me]**. OK. Let me take a look at first one: providing an united data service. After that, I will move to the solution to 'sharing the data/updates to frontend in a timely way'
The real time data(pool data) is already used for the liquidity management service. Let's focus on how the data can be used by the Swap quotes service.
Since AlphaRouter is working as a blackbox in backend, Swap quotes service could resue the pool data in 3 ways: precheck, short-circuit calculation and slippage prediction
- **precheck:**
    Assume we setup a united data query API which could query the latest pool data. Before calling AlphaRouter to get quotes, User can use this API to check if the current pool for the chosen token pair is valid, eg: if the liquidity is depleted or not. If it is invalid, no need to call AlphaRouter in the following steps
- **short-circuit calculation:**
    For the frequent and simple token pairs, we could use the pool data to directly calculate the amount of the target token to avoid running AlphaRouter to get quotes
- **slippage prediction:** 
    Since we stored history records of the pool data, we could use them to predict the slippage to optimize the frontend user experience like giving warnings when the slippage is over the threshold

Sharing the data/updates to frontend in a timely way
**[Me]**. we could use the wesocket: The frontend subscribes the corresponding channel.Once a update arrives from the real time data service, the update is synchronized to frontend via websocket channel

**Summary about the design**
-  Real time processing stream: events on chain -> monitor cluster -> processing cluster -> a united data service(redis & database) - This is the backbone of the design
- Optimized swap: Precheck, short-circuit calculation and slippage prediction based on the united data service
- Websocket: The data updates from the real time stream are sychronized to frontend by websocket

