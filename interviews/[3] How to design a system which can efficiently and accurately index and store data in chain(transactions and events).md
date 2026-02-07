**[Interviewer]** In the previous two designs, we mentioned a critical and fundamental component: the data indexer or the stream processing stream system. For the convenience, I will call it the data indexer.
The data indexer is responsible for monitoring the events on chain, which provides the data source for your real time data service. Let's focus on the indexer.
My question: To support your DEX, please design an efficient and accurate data indexer. This indexer can monitor multiple events issued by smart contracts and persist the structured data for later use(eg: querying) by the upper-level business layer.

The requirements for the indexer:
- **Accuracy:** It can handle the reorganization correctly
- **Efficiency:** It needs to support the rapid synchronization of historical data starting from any historical block height
- **Scalability:** When the new contract addresses need to be monitored, the system should be able to scale horizontally
- **Availability:** The system should have ability to monitor and recover from failures. 

**[Me]** An event in chain from being detected to being saved into database, generally goes through the following process:
1. **Chain events monitoring**
2. **Events parsering**
3. **Chain reorganization detection**
4. **Data processing**
5. **Data persistence**
6. **Data query**

Therefore, the system can be divdied into 6 modules:
1. **Chain events monitoring module:**
    It is responsible for monitoring events on chain. Send the message to the message queue once a new event is detected.
    Use block number + transaction index + log index as the cursor and save it to the database periodically for the purpose of recovery and no missing events
2. **Events parsering module:**
    Consume and parse the message from the message queue. one consumer for one parition
3. **Chain reorganization detection module:**
    Detect the possiblity of the reorganization based on the parsed message. This is a centralized coordinator to manage the reorganization process: broadcast reorganization commands -  suspend, roll back and restore, synchronize statuses etc
4. **Data processing module:**
    Process the parsed message, generate the derivative data by the business requirements
5. **Data persistence module:**
    - Unconfirmed data:
        For the data which has not reached the expected depth(6 confirm or 12 confirm), mark them as 'unconfirmed'. The data includes: orginal event data, parsed data and derivative data. The data are stored in database
    - Confirmed data:
        There is a separate timed task running periodically to scan unconfirmed data and change 'unconfirmed' to 'confirmed' for those  data which have reached the expected depth
    
    For the light query to get the latest data/updates, store them in redis
6. **An united data query module:**
    Provide an united API interface for all services to index the data on chain

Back to your requirements:
- **Accuracy**:
    With the reorganization detection module as the coordinator, we accurately control the rollback process(I will explain it in details how it rollbacks accurately)
- **Efficiency**: 
    To make the reorganization work effiently, we have a dedicated service to synchronize on-chain data to off-chain data. The service is working separately from the data indexer
- **Scalability**: 
    All modules are deployed in a micro-service way except the database which is distributed working in a master-slavery mode
- **Availability**: 
    Guaranteed by ***Fault tolerance*** and ***Monitoring***:
    - Fault tolerance: 
        - checkpoints: saved the cursor for the processed block and offset for the consumed message
        - database backup: backup periodically
        - retry mechanism: for network issue, do exponential backoff retry 
    - Monitoring
        - Check health for all deployed mircoservices
        - Collect logs for analysis. Collect ctritical metrics
        - Set up warning system. Send alarms or email when the ctritical metrics exceed the threshold, and perform or manual intervention after that

**[Interviewer]** Great!. You described the overall proccess of the data indexer which includes 6 modules and 4 requirements (accuracy, efficiency, scalability and availability) are met. Let's focus on the proccess of reorganization which is the key of the data indexer. Can you describe how do you detect the reorganzation?

**[Me]** We've already had a local chain which is maintained by a dedicated service I just mentioned. When the data indexer receives a new block whose parent hash is not equal to the hash of the latest block in the local, a reorganization happened.

**[Interviewer]** When you detected that the reorganization happened, what will you do?

**[Me]** Two steps we will do. 
    1. Find the common parent block we need to roll back to. 
    2. The data indexer enters the reorganization mode and starts the reorganization process.
***Find the common parent block:***
Scan the local chain from the latest block backforward, find the block whose hash is equal to the parent hash of the block the data indexer just received.
If such block exists, it is the common parent block
If not, it means the local chain may crush, we should suspend the data indexer and fix this issue first. To make the design more focused, let's assume the local chain is always consistent with the chain.
***Enter the reorganization mode:***
Once we know the target block we need to roll back to, the data indexer enters the reorganization mode- The data indexer starts the reorganization process.

**[Interviewer]** OK. Your assumption is reasonble. Based on your assumption, let's dive deeper about the step2: the reorganization process.
My question is: 






