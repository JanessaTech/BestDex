**[Me]** 
I need to delivery a solid liquidlity management feature in a limited time  with a solution which could provide a stable pool data
Based on that, I investigated 3 different ways of how to get pool data:
- @live
- Subscription
- self-built data infrastructure indexer
@live is the fastest way, graphclient working with @live aleady deals with the most connection issues. 3 days is enough if we choose this solution. the only drawback of it is it cannnot get real-time pool data
For Subscription, 3 weeks are needed because we need to deal with connection issues like connection stability, data duplication etc
self-built data infrasture indexer is the most complex solution, 6 month may not be enough, which is unacceptable for us.

And, another fact is that the liquidity management doesn't need sub-second real-time formance, we finally chose @live.

With this decision, liquidlity management feature was delivered in the expected time line and @live works well up to now. Meanwhile, I designed the backend architecture to make the preparation for the incoming technical enhancements: 
- In the next 6 month, replace @live with Subscription
- In 2027, start self-built data infrastructure indexer