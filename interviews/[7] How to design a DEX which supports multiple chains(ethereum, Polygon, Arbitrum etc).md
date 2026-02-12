**[Interviewer]** We have discussed about the DEX under a single chain. Suppose the bussiness needs to expand to Ethereum, Arbitrum and Polygon etc. Please enhance your design to support multiple chains. I'd like to know how you design it on the high level.

**[Me]** Here is the list of key points we need to enhance to:
1. Horizontal expansion: multi-chain data indexer layer
2. Vertical insertion: Abstraction layer
3. Reform exsiting services: united services layer
4. Smart route service: The service deciding which chain the swap quotes request should go for
5. United user experience

**[Interviewer]** Tell me more about the high level design above

**[Me]**: Here is the low level design:
1. **Horizontal expansion: multi-chain data indexer layer**
    - **Individual data pipeline**: 
    For each chain, we maintain a separate data indexer: monitoring, message queue, processing etc. It is to ensure the isolation and stability of data synchronization among all chains
    - **United storage**: 
    All structured data (pool states and transaction records) from all piplelines are wrriten into the same centralized storage(database, redis) with each data labeled as the corresonding chain_id.
2. **Vertical insertion: Abstraction layer**
    - **Core interface**: Define ***IChainAdapter*** interface with the common methods like getBalance, readContract, sendTransaction. It is the highly abstract interface comming from the summary of bussiness practices
    - **Adapter implementation**: Each implementation of the adapter works for a specific chain. To make codes cleaner, consider using the template pattern to reuse codes as much as possible
    - **Factory pattern**: We get the individual adapter by ChainAdapterFactory.getAdapter(chain_id) without too much details involved
3. **Reform exsiting services**
    Make all exiting services decoupled with a specific chain by adding a param ***chain_id*** for all services - Swap quotes service, Liquidity management service, Transaction Submission service and United API service. United API service is the entry point to all data queries. Aggregate query results when neccessary. Eg: query user total assets - we need to aggregate the query result for each chain and return the aggregated result instead
4. **Smart route service**
    A new service working behind the API gateway.It is the service which decides which chain the swap quotes request should go for. 
5. **United user experience**
    - **United frontend**: For the user's point of view, the DEX with the multi-chain support is an organic, united portal, not multiple separate sites. It includes: 
        - ***Chain switcher***: user can explicitly choose a specific chain from multiple options
        - ***Assets overview page***: show the user's total assets by calling the united API service
        - ***Recommended chain***: On the swap page, the chain recommended by the Smart route service is set by defaut
    - **Cross-chain bridge integration**: When the user's assets are not matched with the target chain, the frontend can provide 'swap + cross-chain' experience by integrating 3-party cross-chain bridge solutions like Socket、LiFi


**[Interviewer]** Excellent! excellent! I almost see how you write the codes.You mentioned Smart route service, can you tell more about it? How do you design it in details?

**[Me]** The Smart route service aims to smartly make decision about which chain the swap quotes request will go for. On the high level, the design consists of 3 parts:
1. Real time data used to make decision
2. Run the decision-making algorithm 
3. Ensure the performance and reliability

Here is the low level design:
- **The real time data used to make decision**
    - Ihe initial quotes for each chain 
    - The estimation of Base fee, priority fee and total fee in USD
    - The cost of cross-bridge: The estimation of the time needed and the cost for the cross-bridge when neccessary
- **Run the decision-making algorithm**
    - Get the real data above in parallel
    - Calculate the net cost for each chain
        net cost = initial cost - gas used - cost of cross-bridge
    - Apply the filter rules for the purpose of security and user experience:
        - Rules for security: Exclude the chains that suffer from the network congestion and RPC failures
        - Rules for user experiences: If the time needed to finish a transaction exceeds a thredhold, reduce the rank of the specific chain
        - Rules for functionalities: If the amount of target token exceeds a thredhold - the percentage of the depth of pool, reduce the rank of the specific chain
    - Return 1-3 options recommended along with the comparison of critical metrics such as the estimated arrival time of funds/cost/gas fee etc

- **Ensure the performance and reliability**
    - performance: use cache to improve the performance of accessing to data
    - reliability:
        - Set timeout deadline for all external requests. For the data sources which suffer from constant failures, use circuit breaker to temporarily execlude them from the decision-making pool
        - Monitor and asynchrous updates: Monitor the critical metrics such as the deviation rate of quotations, the success rate of chain recommendations and these metrics are adjusted by the admin portal

**[Interviewer]** You mentioned 'If the amount of target token exceeds a thredhold - the percentage of the depth of pool, reduce the rank of the specific chain'. It is a critical risk control strategy. What's the thredhold? Is it set for global or chain-specific?

**[Me]** It is a empirical value we got after several rounds of integration tests and feedback from  users, which is finally decided by the rates of user complaints and success rate of chain recommendations
This value is a chain-specific value, which is saved in backend database which can be updated/maintained by administor or **Smart route service**

**[Interviewer]** Tell me more about the implementation of circuit breaker, especially the implementation about what you mentioned 'For the data sources which suffer from constant failures, use circuit breaker to temporarily exclude them from the decision-making pool'. It mentioned the classical mode used in circuit breaker. Please explain it from the following aspects:
1. which states are used in your implementation? what are the conditions which trigger the switching among different states
2. Where is this circuit breaker strategy used? On the RPC level across all chains or on the finer granularity level saying an specific endpoint?

**[Me]** we have 3 states: Closed/Open/Half-Open. Here is configuration for the circuit breaker:
```
const circuitBreakerConfig = {
  failureThreshold: 3, 
  slidingWindowSize: '10s',
  resetTimeout: '15s' 
};
```
The configuration tells us:
- Turn on the ciruit break when it fails 3 times within 10s. Switch Open to Half-Open after 15s
- Only 1 request is allowed to make a test. If the test is successful, switch the state from Half-Open to Closed, otherwise from Half-Openn to Open

For simplicty, we can set the strategy globally and decide if we need the endpoint-oriented strategy based on situations in the future


**[Interviewer]** How to deal with degradation and extreme cases? eg: In the extreme senarios, all of RPCs suddenly crush, you cannot the real data to do the decision making, how does your **Smart route service** behave in this case? 

**[Me]** I will use the latest cached data plus an stale data thredhold instead as the degradation plicy. If the latest cached data exceeds the thredhold, report error directly.

**Summary about the design**
1. **Clear architecture and smooth evolution**: Through horizontal expansion of data indexer and vertical insertion of abstract layer, the core bussiness logic of exisiting single-chain architecture is maxically reused
2. **Decouple the bussiness with chains**: The united services layer no longer concerns a specific chain. All heterogeneous details are encapsulated in chain-oriented adapter, which makes the cost of the expansion to a new chain in the future extremely low
3. United user experience: Users can manage all assets using one portal while enjoying the covenience brought by the **Smart route service** - the best chain recommended