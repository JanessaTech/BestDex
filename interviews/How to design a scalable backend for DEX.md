**[Interviewer]** ***Please describe how your backend works. eg, when you click swap, what will happen in backend?***
**[Me]** For swapping, it is better to describe how it works both in frontend and backend, because the frontend plays an important role in swapping.
First, user chooses a pair of tokens in the frontend and clicks [get quotes] the button which calls AlphaRouter, an API provided by uniswap, running in backend to get the estimation of the target token and gas used. It returns the calldata the frontend will use to call the **swap** function defined in **UniswapV3Pool**.
Once the quotes is returned, in the frontend, user needs to approve the amount of token he needs to do the swap from. After the approval, a simulation for the swapping will run before calling the **swap**. The **swap** will run only after the simuation is successful.
Based on the explanation above, we know: backend runs **AlphaRouter** only, which is the MVP requirement 
For the next version of the DEX, there are a lot of things we need to work on to improve the performance of it.

**[Interviewer]** ***Suppose your DEX suddenly gains a large number of users and volume of exechang requests increases by 100 times, what do you think is the first bottleneck and why?***
**[Me]** First, I will list all of potential bottlenecks then figure out the first potential one and give you the reason why it is.
- **The computation of AlphaRouter:** it takes 3-10 seconds for 1 request. If there will be a large number of requests coming in a short period of time, most requests would be extremely slow or even rejected
- **The backend processing capability:** With 100 times of requests, the CPU and memory may become the bottlenecks
- **The network:** The traffic between frontend and backend and backend and blockchain will be much higher, which may lead to the network congestion
- **The Database:** we need to store the result for each swapping. The database has the potential read-write issue under the high volumn of requests

Of the all potential bottlenecks above, the backend will be the first bottleneck because it is the entry point for requests and it has only 1 server running without considering the concurrent processing techniques like micro-service used to deal with a large volume of requests.
To make the issue worse, each request needs to call AlphaRouter running in backend to get quotes, which takes 3-10 seconds on average. With a large volume of swapping requests, the response delay will further increase the pressure on backend

**[Interviewer]** ***Excellent! you pointed out 4 bottlenecks: computation for AlphaRouter, backend resouces, network and database. Let's focus on the P1 bottleneck you just mentioned. What's your solution? Our aim is to make your DEX support 1000 requests per second***
**[Me]**
    - Perform the horizontal expansion of the backend services and use the load balance to distribute requests
    - Introduce the caching technique like redis. Cache the quotes for the frequent token pairs by pre-compuation triggered by timed tasks to speed up the performance
    - Optimize database. eg. for non-crital operations like logging, process it asynchronously
    - Consider using message queue to handle swapping requests asynchronously for the peak shaving, but this may sacrifice the real-time performance 

**[Interviewer]** ***Good. Your solution is already a production-level mature design, fully capturing the key points: microservices provide the scalability to address computational issues, caching techniques resolve issues related to real-time performance and latency. Now let's dive deeper about several critical designs, which will make your solution more rigorous and complete***
1. Cache invalidation and data consitency

2. Cache granularity and hit rate
3. Service discovery and load balance



