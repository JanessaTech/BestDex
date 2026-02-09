**[Interviewer]** We have discussed about the DEX under a single chain.Suppose the bussiness needs to expand to Ethereum, Arbitrum and Polygon etc. Please enhance your design to support multiple chains. I'd like to know how you design it on the high level.

**[Me]** Here is the list of key points we need to enhance to:
1. Horizontal expansion: multi-chain data indexer layer
2. Vertical insertion: Abstraction layer
3. Reform exsiting services: united services layer
4. Smart route service: The brain deciding which chain the request should go for
4. United user experience

More details seen as following:
1. **Horizontal expansion: multi-chain data indexer layer**
    - Individual data pipeline: 
    For each chain, we maintain a separate data indexer: monitoring, message queue, processing etc. It is to ensure the isolation and stability of data synchronization among all chains
    - United storage: 
    All structured data (pool states and transaction records) from all piplelines are wrriten into the same centralized storage(database, redis) with each data labeled as the corresonding chain_id. United API service is the entry point to these data 
2. **Vertical insertion: Abstraction layer**
    - Core interface: Define IChainAdapter interface with the common methods like getBalance, readContract, sendTransaction. It is the highly abstract interface comming from the summary of bussiness practices
    - Adapter implementation: Each implementation of the adapter works for a specific chain. To make codes cleaner, consider using the template pattern to reuse codes as much as possible
    - Factory pattern: We get the individual adapter by ChainAdapterFactory.getAdapter(chain_id) without too much details involved
3. **Reform exsiting services**
    Make all exiting services decoupled with a specific chain by adding a param chain_id for all services - Swap quotes service, Liquidity management service, Transaction Submission service and United API service. United API service is the entry point to all data queries. Aggregate query results when neccessary. Eg: query user total assets - we need to aggregate the query result for each chain and return the aggregated result instead
4. **Smart route service**
    A new service working behind the API gateway.It is the brain of the multi-chain system - decides which chain the user request should go for. 
4. **United user experience**
    - **United frontend**: For the user's point of view, the DEX with the multi-chain support is an organic, united portal, not multiple separate sites. It includes: 
        - ***Chain switcher***: user can explicitly choose a specific chain from multiple options
        - ***Assets overview page***: show the user's total assets by calling the united API service
        - ***Recommended chain***: On the swap page, the chain recommended by the Smart route service is set by defaut
    - **Cross-chain bridge integration**: When the user's assets are not matched with the target chain, the frontend can provide 'swap + cross-chain' experience by integrating 3-party cross-chain bridge solutions like Socket、LiFi