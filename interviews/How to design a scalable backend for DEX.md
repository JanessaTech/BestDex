1. Please describe how your backend works. eg, when you click swap, what will happen in backend?
For swapping, it is better to describe how it works both in frontend and backend, because the frontend plays an important role in swapping.
First, user chooses a pairs of tokens in frontend and clicks [get quotes] button. it calls AlphaRouter, an API provided by uniswap, running in backend to get the estimation of the target token and gas used. More importantly， it returns the calldata the frontend will use to call the real swapping functionality.
Once the quotes is returned, user needs to approve the amount of token he needs to exchange from. After the approval, a simulation for the swapping will run before the real swapping. The real swapping will run only after the simuation is successful.
So you can see, for swapping, backend runs AlphaRouter only, which is the MVP requirement 
For the next version of DEX, there are a lots of things we will work on to improve the performance.


2. Suppose you DEX suddenly has more than 100 times users requesting swapping, what do you think is the first bottleneck and why?