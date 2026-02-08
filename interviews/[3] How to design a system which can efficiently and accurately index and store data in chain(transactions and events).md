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
2. **Events parsing**
3. **Chain reorganization detection**
4. **Data processing**
5. **Data persistence**
6. **Data query**

Therefore, the system can be divdied into 6 modules:
1. **Chain events monitoring module:**
    It is responsible for monitoring events on chain. Send the message to the message queue once a new event is detected.
    Use block number + transaction index + log index as the cursor and save it to the database periodically for the purpose of recovery and no missing events
2. **Events parsing module:**
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
    All modules are deployed in a micro-service way except the database which is distributed working in a master-slavery mode.
    The message queue is introduced to adapt to new contract addresses
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
Once we know the target block we need to roll back to, the data indexer enters the reorganization mode - The data indexer starts the reorganization process.

**[Interviewer]** OK. Your assumption is reasonble. Based on your assumption, let's dive deeper about the step2: the reorganization process.
My question is: In a high-concurrency system, we need to guarantee the atomicity and eventual consistency of operations. Assume your data indexer is running at a high speed: chain events monitoring module is processing the block N, data processing module is processing the block N-2, 
reorganization detection module suddenly notifies us: A reorganization is detected, we need to roll back to block N-1. Please enhance the design to ensure that all modules can smoothly and consitently roll back to the target block without the dirty data and chaos 

**[Me]** we have a centralized coordinator to manage all modules: suspend, roll back and restore.
The main process of the reorganization:
- Reorganization detection
    Once the reorganization is detected, send the coordinator a reorgnization event which includes: target block number to roll back, the newly received block
- Broadcast suspending
    Once the coordinator receives the reorgnization event, it broadcasts the suspending command to all modules(event monitoring, event parsing, data processing, data persistence) by message bus or rpc.
    Once each module recieves the suspending command, it finishes the task it working on without accepting new ones. Once it is done, send the status to the coordinator.
    When all of module are ready, the coordinator starts the roll back command. It records the reorganization status before roll back: the target block number, current new block number, the status of each module(especially the block number each module is working on), roll-back steps
- Roll back
    The roll-back steps are in the reversible order of how an event is processed.
    For example, an event is proccessed in the order of event monitoring -> event parsing -> data processing -> data persistence, the roll-back steps will be data persistence -> data processing -> event parsing -> event monitoring.
    All of steps are executed sequentially to prevent dirty data and chaos
    During the execution of roll back in each step, the corresponding module should save check points periodically and report the status(where it is) to the coordinator. The coordinator itself also needs to save checkpoints for the recovery
    The equential execution and checkpoints make sure the correct recovery when one of modules even the coordinator itselft suddenly crushes
    The above is about the roll back on the high level. Actually, for different module, the operations in the execution of roll back are a lot different:
    - For the data persistence module(database): roll back data including derivative data (not deletion but mark them as 'deleted') under the transaction
    - For the data processing module and events parsing module(message queue consumer): discard messages/memeory data belonging to the roll-back blocks or simply reset the offset if this operation is supported
    - For the message queue: clear the messages belonging to the roll-back blocks
    - For the events monitoring module: reset cursor(check point) and clear uncofirmed messages belonging to the roll-back blocks

    Once all of modules are finished with the execution of roll back, the coordinator marks the roll back done and starts restoring
- Restore
    The coordinator sends the restoring command to all modules, telling them to start with target block number + 1

There are 2 issues we need to pay attention to in the process of the reorganization:
- **split-brain**: In the process of sending commands(suspend, roll back and restore) between coordinator and all modules, we use the mixed communicating strateges of active reporting(from modules to coordinator) and passive query/timeout(from coordinator to modules) to prevent the split-brain: Once the coodinator find no active reporting or timeout when passive query for a module, the coordinator thinks that this module died and enables the backup of this module
- **atomicity and idempotence**: In the roll back of each module, we should ensure operations within each module are atomic and idempotent to prevent inconsistence


**[Interviewer]** Excellent! The core strength of your solution lies in its strong consistence and control. The centralized coordinator can make sure that all modules are in step during the organizaiton process, making it suitable for finanal senarios which require the high accuracy for the data consistency. However. in a distributed system, a classic challenge is that the centralized coordinator itself can become a single point of failure or a performance bottleneck. How does your reorganization coordinator ensure its high availability. Eg, it crashes after broadcasting suspending, how can you prevent the entire system from indefinitly suspending?

**[Me]** To prevent the coordinator from becoming the single point of failure, the design can be enhanced like this: I will implement the coordinator as a small cluster based on the Raft consensus algorithm with all critical states persisted to external storage. If the leader crushes, the cluster can automatically elect a new leader from the persisted states without causing the system suspending indefinitely.

Here is the key implemenations:
- Clustered Coordinator:
    - The cluster consists 3 - 5 nodes, one leader, the others as followers
    - All of reorganization commands or state changes are replicated within the cluster as the Raft logs, Only the leader can broadcast the commands&changes, ensuring the consistency
    - Once the leader crushes, the new leader can be elected in a few seconds
- External persistence of coordinator states: 
    - **Reorg context** is written to the external strongly consistent storage(eg: etcd、ZooKeeper) before the coordinator starts any critical operations.
    - The **Reorg context** must inlcude:
        - targetBlockNumber: the target block to roll back to
        - newBlockHash: the hash of the newly received block
        - phase: current stage(SUSPENDING, ROLLING_BACK, RESTORING)
        - moduleStatuses: a map, recording the latest status of each module(monitoring, parsing, processing and persistence)(eg: suspended, rolled back to block X etc)
        - coordinatorCheckPoint: the coordinator itself's check point
        - rollBackSteps: The steps needed to execute rolling back


**Summary about the design**
- Raft-based coodinator cluster: This is the brain of chain reorganization
- 6 modules working in stream pipeline: monitoring, parsing, organization detection, processing, persistence and the united data query

**Introduction of this design:**
To support DEX, I designed a data indexer to solve a core pain: it needs to provide the low-latency real-time data while ensuring the absolute correctness of data after blockchain reorganization. My design is a processing pipeline based on event streams. The key of the design is a Raft-based centralized coordinator cluster to ensure the strong correctness in the reorganization