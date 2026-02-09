**[Interviewer]** In most DeFi applications, the transctions may be front run or suffer from suboptimal routes. Based on your existing architecture, please enhance it to support:
1. Try to avoid front-running as much as possible to protect users' transactions
2. Provide users with the best exchange rates

**[Me]** Let me share my solution one by one. First, try to avoid front-running.
We need to enhance the exsiting transaction service to make it:
1. Broadcast the signed transaction to ***Flashbots Protect RPC*** or similar private relay service which fundamentally eliminates most of sandwich attacks
2. Double confirmed simulation. Besides the simulation running in the frontend before calling the transaction service, do a simulation again using the latest block states. If the simulation shows that the final result exceeds the threshold, return a warning to users

**[Me]** Provide users with the best exchang rates.
