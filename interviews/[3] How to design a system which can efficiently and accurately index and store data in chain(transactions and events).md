**[Interviewer]** In the previous two designs, we mentioned a critical and fundamental component: the data indexer or the stream processing stream system. For the convenience, I will call it the data indexer.
The data indexer is responsible for monitoring the events on chain, which provides the data source for your real time data service. Let's focus on the indexer.
My question: To support your DEX, please design an efficient and accurate data indexer. This indexer can monitor multiple events issued by smart contracts and persist the structured data for later use(eg: querying) by the upper-level business layer.

The requirements for the indexer:
- **Efficient:** It needs to support the rapid synchronization of historical data starting from any historical block height
- **Scalable:** When the new contract addresses need to be monitored, the system should be able scale horizontally
- **Available:** The system should have ability to monitor and recover from failures. 

**[Me]** An event in chain from being detected to being saved into database, generally goes through the following process:
1. **Events monitoring**
2. **Events parsering**
3. **Chain reorganization detection**
4. **Data processing**
5. **Data persistence**
6. **Data query**

Therefore, the system can be divdied into 6 modules:
1. **Chain event monitoring module:**
    It is responsible for monitoring events on chain. It has mulitple monitoring instances which are partitioned by the pool address. Send the message to the message queue once a new event is detected.
    Use block number + transaction index + log index as the cursor and save it to the database periodically for the purpose of recovery
2. **Events parsering module:**
    Consume and parse the message from the message queue. one consumer for one parition
3. **Chain reorganization detection module:**
    Detect the possiblity of reorganization based on the parsed message. Manage the reorganization process
4. **Data processing module:**
    Process the parsed message, generate the derivative data based from business purpose
5. **Data persistence module:**
    Store the processed data to database for the history query
    Stream the lastest processed data to redis for the pool state query
6. **An united data query module:**
    Provide an united API interface for all services to index the data on chain




