/* handler.js */
const {
  graphql,
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLNonNull
} = require('graphql');
const express = require('express');

const AWS = require('aws-sdk');
const graphqlHTTP = require('express-graphql');
const IS_OFFLINE = process.env.IS_OFFLINE;
const dynamoDbConfig = {};
if (IS_OFFLINE) {
	Object.assign(dynamoDbConfig, {
		region: 'localhost',
		endpoint: 'http://localhost:8000'
	});
}

const dynamoDb =  new AWS.DynamoDB.DocumentClient(dynamoDbConfig);

const promisify = getUser => new Promise((resolve, reject) => {
	
	getUser((error, result) => {
	  if(error) {
		reject(error)
	  } else {
		resolve(result)
	  }
	})
  })
  
  // replace previous implementation of getGreeting
  const getGreeting = firstName => promisify(callback =>
	dynamoDb.get({
	  TableName: process.env.USERS_TABLE,
	  Key: { firstName },
	}, callback))
	.then(result => {
	  if(!result.Item) {
		return firstName
	  }
	  return result.Item.nickname
	})
	.then(name => `Hello, ${name}.`)
  
	// add method for updates
  const changeNickname = (firstName, nickname) => promisify(callback =>
	dynamoDb.update({
	  TableName: process.env.USERS_TABLE,
	  Key: { firstName },
	  UpdateExpression: 'SET nickname = :nickname',
	  ExpressionAttributeValues: {
		':nickname': nickname
	  }
	}, callback))
	.then(() => nickname)

	
// Here we declare the schema and resolvers for the query
const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'RootQueryType', // an arbitrary name
    fields: {
      // the query has a field called 'greeting'
      greeting: {
        // we need to know the user's name to greet them
        args: { firstName: { name: 'firstName', type: new GraphQLNonNull(GraphQLString) } },
        // the greeting message is a string
        type: GraphQLString,
        // resolve to a greeting message
        resolve: (parent, args) => getGreeting(args.firstName)
	  }
    }
  }),
  mutation: new GraphQLObjectType({
    name: 'RootMutationType', // an arbitrary name
    fields: {
      changeNickname: {
        args: {
          // we need the user's first name as well as a preferred nickname
          firstName: { name: 'firstName', type: new GraphQLNonNull(GraphQLString) },
          nickname: { name: 'nickname', type: new GraphQLNonNull(GraphQLString) }
        },
        type: GraphQLString,
        // update the nickname
        resolve: (parent, args) => changeNickname(args.firstName, args.nickname)
      }
    }
  })
})

const app = express();
app.use('/graphql', graphqlHTTP({
	schema: schema,
	graphiql: true,
}));
app.listen(3000);

console.log('Running a GraphQL API server at localhost:3000/graphql');

module.exports.handler = serverless(app);

