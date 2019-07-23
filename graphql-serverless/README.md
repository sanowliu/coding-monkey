### Installation guide
Install serverless-dynamodb-local
`$ sls dynamodb install`
Then install node_modules
`$ npm install`
Start serverless graphql with local dynamodb and have fun
`$ sls offline start`

### Examples
Post a nick name for a user

`curl -G 'http://localhost:3000/query' --data-urlencode 'query=mutation {changeNickname(firstName:"Jeremy", nickname: "Jer")}'`

Read nick name for an existing user 
`curl -G 'http://localhost:3000/query' --data-urlencode 'query={greeting(firstName: "Jeremy")}'`

Read nick name for a non-existing user 
`curl -G 'http://localhost:3000/query' --data-urlencode 'query={greeting(firstName: "Mike")}'`

This example is derived from 
[Deploy a REST API using Serverless, Express and Node.js](https://serverless.com/blog/serverless-express-rest-api/ "Deploy a REST API using Serverless, Express and Node.js") 
and 
[How to Make a Serverless GraphQL API using Lambda and DynamoDB](https://serverless.com/blog/make-serverless-graphql-api-using-lambda-dynamodb/ "How to Make a Serverless GraphQL API using Lambda and DynamoDB")