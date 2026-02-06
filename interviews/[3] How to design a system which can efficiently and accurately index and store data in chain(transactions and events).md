**[Interviewer]** In the previous two designs, we mentioned a critical and fundamental component: the data indexer or the stream processing stream system. For the convenience, I will call it the data indexer.
The data indexer is responsible for monitoring the events on chain, which provides the data source for your real time data service. Let's focus on the indexer.
My question: To support your DEX, please design an efficient and accurate data indexer. This indexer can monitor multiple events issued by smart contracts and persist the structured data for later use(eg: querying) by the upper-level business layer.

The requirements for the indexer:
- **Accurate:** It must be capable of correctly handling the re-organization of the chain
- **Efficient:** It needs to support the rapid synchronization of historical data starting from any historical block height
- **Scalable:** When the new contract addresses need to be monitored, the system should be able scale horizontally
- **Available:** The system should have ability to monitor and recover from failures. 

**[Me]** An event in chain from being detected to being saved into database, generally goes through the following process:


