**[Interviewer]** We know the interation(via rpc calls) between the frontend and blockchain nodes is the one of key root causes of the performance issue and the single point of failure. Please design a system which can optimize the rpc calls to improve the performance and stability for your frontend. Please first think about answer: During the entire lifecycle of interaction between the frontend and blockchain(from page loading to user sending a transaction), which specific scenarios have the frequent, slow , or cirtical rpc calls? Please list 2-3 typical scenarios that you want to optimize.

**[Me]** Retrieving account balance and sending transaction are 2 scenarios I want to optimize.

**[Interviewer]** Tell me more about optimizing rpc calls to retrive account balance to address the performance issue

**[Me]** The core is to combine the cache in fronend, API gateway, the cache in backend and updates by websocket to optimize the performance of rpc calls. Here is how it goes:
1. Check the cache in the frontend. If the cached data exists, return the value directly
2. If it fails to hit in the frontend cache, call the corresponding backend API via API gateway
3. If the call hits the cache defined in API gatway, return the value. 
4. If the call doesn't hit the the cache defined in API gatway, check if it can be merged. Return at once if it can be merged
5. If it can not be merged, call backend API to check the cache in backend. It it hits, return the value at once. If it doesn't, call rpc to get the value from blockchain
6. The response returned the backend should be appended the information regarding 'Cache-Control' in the header at API gateway, which will be used by frontend to set the caching strategy
7. Websocket pushes the updates coming from monitoring events in chain to the frontend and updates the cache in the frontend

**[Interviewer]** Tell me more about optimizing rpc calls to send transaction to address issues: 1. no feedback when a transation is sent 2. the transation state is unknow while in waiting 3. no clear guide about how to do next when the transaction fails

**[Me]** The core is:
- Once a transaction is sent to a delicated transaction service in backend by the frontend, a status tracking id is returned immediately
- The transaction service sends the singed transaction asynchronously
- The transaction service gets the update regarding the transaction from the data indexer and synchroinzes the update to frontend via websocket

**[Interviewer]** Could you tell me more about the transaction service? How does it work?

**[Me]** The transaction service is used to send the signed transaction to blockchain and listens to the update regarding this signed transaction via the data indexer which is the data infrastructure system used to monitor events and receipts in chain. Once the update arrives, the transaction service synchronizes the update to the frontend via websocket

Here is the data flow of how the transaction service works combined with the frontend:
1. The frontend submits a signed transaction to the transaction service
2. The transaction service generates a ***trakingId*** for the signed transaction and returns it to the frontend immediately. Then it sends a message consisting the trakingId and the signed transaction to a message queue
3. A consumer consumes a message from the queue and then broadcasts the the signed transaction to get ***txHash***. We create a mapping between trakingId and txHash
4. The data indexer is monitoring both events and receipts on chain. A transaction final event is created after parsing the receipts. The transaction final event includes: txHash, status(0 / 1), blockNumber and gasUsed etc. This event is sent to the message queue waiting for the transaction service to consume it 
5. Once the transaction final event is consumed by the transaction service, it gets the critical fields like txHash、status etc from the message and figrues out the trackingId by the mapping between trackingId and txHash. Finally, it sychronizes the status of the signed transaction to the frontend by trackingId via websocket


**[Interviewer]** Execellent! you described all details regarding the transaction service, the design is almost ready to get coded. One more question: do you think it is necessary to package all steps of what we did to optimize the rpc calls into a SDK used by the frontend?

**[Me]** That's a good idea! I will package the following steps into the SDK:
- checking the cache in the frontend
- sending request to API gateway
- updating the caching strategy accoring to the response returned by API gateway
- Setting up the websocket connection and updating cache after an update arrives

I could call this SDK the intelligent SDK

**Summary about the design**
- Combined with cache in frontend, API gateway, cache in backend, websocket and the data indexer to improve the performance of rpc calls
- The transaction services plays a middle-man role to send transaction and synchronize the updates
- Using the SDK to package details of optimization
