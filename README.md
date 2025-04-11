# A script for Discord board monitoring and pings
## Environment Variables
- BOT_TOKEN
- JOB_POST_CHANNEL_ID
- JOB_PINGS_CHANNEL_ID
- SERVER_ID

## Deployment
Deploy as a serverless function and set up scheduler to invoke it periodically with your favorite tools
Here is an example using [AWS Lambda](https://aws.amazon.com/lambda/) and [AWS EventBridge](https://aws.amazon.com/eventbridge/)

### Use AWS Lambda for hosting
https://aws.amazon.com/lambda/

### Use AWS EventBridge for scheduling
https://aws.amazon.com/eventbridge/
