**[Interviewer]** Can you describe the data flow from the fronend to blockchain?
**[Me]** OK. The overall data flow can be divided into 3 stages:
1. Get quotes
2. Simulation and transaction sumbmition
3. Synchronization of state and data archiving

Let me explain them in details.
- ***Get quotes*** 
    - **Frontend**: User chooses a pair of token, input the amount to exchange and click ***Get quotes*** button
    - **SDK**: Check it hits in the local cache. If it hits, returns value, otherwise, call api ***POST /api/quote*** to gateway
    - **API gateway**: Perform request merging / degradation / circuit-breaking process. Check if the cache in gateway is hit, if not, transfer the api call to ***Swap quotes service***
    - **Swap quotes service**: 
        - **Precheck**: Call the united API service to check if the target pool is valid. eg: check if the liquidity is depleted. If it is invalid, return directly
        - **Cache**: Check the cache to see if there exists the result which is pre-comuptated for the inputs. Return result if it hits
        - **Short-circuit calculation**: For the most frequent token pairs, use the off-chain pool data to calculate the target amount without running AlphaRouter calling
        - **Core computation**: If the pool is valid, the cache doesn't hit, no need the short-circuit calculation, we call AlphaRouter which will cost 2-10 seconds on average to calculate the quotes based on the inputs via rpc
        - **Slippage prediction**: Meanwhile, we could use the historic pool data to predict the slippage to improve the user experience in UI
    - **Response**: For the response returned by backend, append the cache strategy in the header with the key ***'Cache-Control'*** which will be used by frontend

- ***Simulation and transaction sumbmition*** 
    - **Frontend**: Once the frontend receives the quotes, it constructs a simulation and runs it to check if the swapping transaction constructed by the result returned by 'Get quotes' has potential to fail
    - **SDK**: If the simulation is successful, the frontend calls the SDK to submit the signed swapping transaction to the transaction service
    - **API gateway**: API gateway intercepts the request above, perform the request merging / degradation / circuit-breaking process and transfer the request to the transaction service
    - **Transaction service**:
        - **Asynchronous submition**: Generate a trackingId immediately and return it to the frontend. Put a message(trackingId, the signed swapping transaction) into a message queue
        - **Broadcast transaction**: Consume the message, broadcast the signed swapping transaction, get txHash and set up a mapping between txHash and trackingId
         
- ***Synchronization of state and data archiving*** 
    - **Data indexer monitoring**: Monitor events and receipts on chain in stream pipeline. Create a transaction final event for each receipt after parsing. The transaction final event includes: txHash, status(0 / 1), blockNumber and gasUsed etc. This event is sent to the message queue waiting for the transaction service to consume it 
    - **Transaction service as the consumer**: The transaction service consumes the message, get txHash, status etc from the message and find the trackingId by txHash in the mapping between txHash and trackingId
    - **Websocket synchronize the state to frontend**:
        The websocket synchronizes the status by trackingId to the frontend
