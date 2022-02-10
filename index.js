const { ApolloServer, gql } = require('apollo-server');
const { ApolloGateway, RemoteGraphQLDataSource } = require('@apollo/gateway');
var  propertiesReader  = require('properties-reader')

var properties = propertiesReader('application.properties');
const categoryGraphqlServerUrl=properties.get('categories_graphql_server_url');
const content_graphql_server_url=properties.get('content_graphql_server_url');

/*const gateway = new ApolloGateway (
  {
    serviceList: [{"name": "categories", url: categoryGraphqlServerUrl},
    {"name": "contents", url: content_graphql_server_url}
    ]
  }
);*/

const gateway = new ApolloGateway({
  serviceList: [{"name": "categories", url: categoryGraphqlServerUrl},
    {"name": "contents", url: content_graphql_server_url}
  ],

  buildService({ name, url }) {
    return new RemoteGraphQLDataSource({
      url,
      willSendRequest({ request, context }) {
        // pass the user's id from the context to underlying services
        // as a header called `user-id`
        request.http.headers.set('x-user-id', context.userId);
        if (context && context.req && context.req.headers && context.req.headers.authorization) {
          request.http.headers.set('xauthorization', context.req.headers.authorization);
        }
        
      },
    });
  },
});
  
// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({ gateway,subscriptions:false,
  context: ({ req }) => ({
    req,
    /* 
      this is the important bit:
      we extract the needed headers and then 
      set up a customHeaders property on the context object
    */
    customHeaders1: {
      headers: req.headers,
    },
  })
});

// The `listen` method launches a web server.
server.listen().then(({ url }) => {
  console.log(`🚀  Graphql gateway Server ready at ${url}`);
});

function filterHeaders(headers, nameList) {
  return nameList
    .map(name => name.toLowerCase())
    .reduce((acc, name) => ({
      ...acc,
      [name]: headers[name]
    }, {}))
    .filter(Boolean);
}

