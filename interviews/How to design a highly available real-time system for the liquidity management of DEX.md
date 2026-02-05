**[Interviewer]** In order to design a highly available & real-time data service used to get UniswapV3Pool states, please describe:
1. The most critical real-time data: when user opens the liquidity management page
2. The source of data updating : which events trigger the updating?

**[Me]**. 1. The most critical real-time data: liquidity, tick and sqrtPriceX96.They are critical to render the liquidity management page
2. Swap, Mint, Burn and DecreaseLiquidity(defined In NonfungiblePositionManager)

**[Interviewer]** Good. You hit the core of DeFi integration: monitor the events on the chain and synchronzie the state on the off-chain. Let's start the design. Our aim is to evolve it into a "highly available real-time data service"
My first question is: you mentioned you update pool states when one of events swap, Mint, Burn and DecreaseLiquidity is detected. The swap event is the most frequent on. Suppose there are thousands of swaps per second in different pools, how do design your monitor so that there is no event missing, no delay and it can quickly recover from faults?
**[Me]** I will design a distributed, message queue-based stream processing architecture. I will explain it from 3 aspects: event monitor, processing and health monitor& fault recovery :
- **event monitor**:
    design monitor cluster with multiple monitor instances. Each instance is connected to a connection pool which manage multiple rpc providers or self-built nodes
    each monitor instance is partitioned according to the pool address, which could make sure all events belonging to the same pool are processed sequentially
    Once a new event is received by one monitor instance, it is sent to message queue.
    To make sure no missing events, implement Exactly-Once processing semantics: on the event monitor side, use transaction_hash + logindex as the cursor and save it to database periodically 
- **processing**:
    there are multiple processing consumers to process messages in the message queue. To finish Exactly-Once processing semantics, on the processing side, send the confirmation after one message is proccessed, combined with database transaction. save the message offset to database
- **health monitor& fault recovery**:
    - health monitor:
        delay monitoring: set up delay metrics across different processing stage of an event: on chain -> being detected, being in queue, being processed
        backlog monitoring: monitor the lag situation of each message
        health check: monitor healthy status of each instance
    - fault recovery:
        using heart beat mechanism to detect the failure of monitor instance and processing consumer.
        If one processing consumer crushed, start a new one and consume the message from the offset which is already saved in database
        If one monitor instance crushed, switch to the backup monitor instance, start the scanning from the cursor which is already saved in database


