**[Interviewer]** ***Please describe how your backend works. eg, when you click swap, what will happen in backend?***

**[Me]** For swapping, it is better to describe how it works both in frontend and backend, because the frontend plays an important role in swapping.
First, user chooses a pair of tokens in the frontend and clicks [get quotes] the button which calls AlphaRouter, an API provided by uniswap, running in backend to get the estimation of the target token and gas used. It returns the calldata the frontend will use to call the **swap** function defined in **UniswapV3Pool**.
Once the quotes is returned, in the frontend, user needs to approve the amount of token he needs to do the swap from. After the approval, a simulation for the swapping will run before calling the **swap**. The **swap** will run only after the simuation is successful.
Based on the explanation above, we know: backend runs **AlphaRouter** only, which is the MVP requirement 
For the next version of the DEX, there are a lot of things we need to work on to improve the performance of it.

**[Interviewer]** ***Suppose your DEX suddenly gains a large number of users and volume of swapping requests increases by 100 times, what do you think is the first bottleneck and why?***

**[Me]** First, I will list all of potential bottlenecks then figure out the first potential one and give you the reason why it is.
- **The computation of AlphaRouter:** it takes 3-10 seconds for 1 request. If there will be a large number of requests coming in a short period of time, most requests would be extremely slow or even rejected
- **The backend processing capability:** With 100 times of requests, the CPU and memory may become the bottlenecks because there is only 1 server running for now.
- **The network:** The traffic between frontend and backend and backend and blockchain will be much higher, which may lead to the network congestion
- **The database:** we need to store the result for each swapping. The database has the potential read-write issue under the high volumn of requests

Of the all potential bottlenecks above, the backend will be the first bottleneck because it is the entry point for requests and it has only 1 server running without considering the concurrent processing techniques like micro-service used to deal with a large volume of requests.
To make the issue worse, each request needs to call AlphaRouter running in backend to get quotes, which takes 3-10 seconds on average. With a large volume of swapping requests, the response delay will further increase the pressure on backend

**[Interviewer]** ***Excellent! you pointed out 4 bottlenecks: computation for AlphaRouter, backend resources, network and database. Let's focus on the P1 bottleneck you just mentioned. What's your solution? Our aim is to make your DEX support 1000 requests per second***

**[Me]**
    - Perform the horizontal expansion of the backend services and use the load balance to evenly distribute requests
    - Introduce the caching technique like redis. Cache the quotes for the frequent token pairs by pre-compuation triggered by timed tasks to speed up the performance
    - Optimize database. eg. for non-crital operations like logging, process it asynchronously
    - Consider using message queue to handle swapping requests asynchronously for the peak shaving, but this may sacrifice the real-time performance 

**[Interviewer]** ***Good. Your solution is already a production-level mature design, fully capturing the key points: microservices provide the scalability to address computational issues, caching techniques resolve issues related to real-time performance and latency. Now let's dive deeper about several critical designs, which will make your solution more rigorous and complete***
1. Cache invalidation and data consitency
    The pre-compution is the key in your caching techniques. However, the state of blockchain may get changed in the time window of your cached data(eg: a large transaction suddenly depletes the liquidity of a pool)
    - How do you make sure that users cannot get outdated/invalid quotes which may lead to a failed transaction?
    - Besides the timed task, is there any technique which can timely detect the significant changes in chain and actively invalidate the cache?
2. Cache granularity and hit rate
    - How do you design the key of the cached data(quotes)?
    - How do you balance the hit rate and the accucary of cache?
3. Service discovery and load balance
    - How do you evenly distribute requests across microservices? k8s + load balance ? API gateway ? simple round-robin？
    - When a new service instance used for quotes becomes on/off, how do you detect it timely?

**Cache invalidation and data consitency**

**[Me]** The strategy is we should have a solid data infrasture layer which we call data indexer/ event stream system or whatever you like. For simplicity, let's call it the data indexer. The data indexer can monitor all swap events in chain. It synchronizes the critical states in UniswapV3Pool saying tick and liquidity to local when a swap event arrives. When it detects that the liquidity of a certain pool is dried up, it actively invalidates the corresponding cached data

**Cache granularity and hit rate**

**[Me]**
- How do you design the key of the cached data(quotes)
    The format of key is : token-pair + time-window + amount range.
    For example, for the swap request (WETH->USDC) at the timestamp 1764751061 to exchange 999 WETH, the key is:
    WETH-USDC:29412517:900-1000 (we assume the time window is 1 min. 1764751061/60 is rounded down to 29412517)
- How do you balance the hit rate and the accucary of cache?
    I have a simuation operation before the swapping. we can use the failure rate of this operation to adjust the final balance

**Service discovery and load balance**

**[Me]**
- How do you evenly distribute requests across microservices? k8s + load balance ? API gateway ? simple round-robin？
    We can use API gateway with the algorithm saying polling or minimum connection number configured to get even distribution
- When a new service instance used for quotes becomes on/off, how do you detect it timely?
   At the early stage, you can use the static configuration. At the advanced stage, consider the dynamic service discovery using 3-party solutions saying consul, etcd , Kubernetes etc

**Summary about the design**

The design above resolved 4 key potential bottlenecks:
- The computation/backend capabilty: with the horizontal expansion, the computation is evenly distributed across different microservices  
- The network: with the caching techniques, the majority of repetitive quotes queries are reduced, which significantly reduce the pressure of AlphaRouter and RPC calling
- The database: The database issue is not serious in the design compared to the issues above. You can use message queue to decouple IO request and IO writing when necessary

