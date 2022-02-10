const { ApolloServer, gql } = require('apollo-server');
const { buildSubgraphSchema } = require ('@apollo/subgraph')

var  propertiesReader  = require('properties-reader')

const { contentResolvers } = require('./components/contents/contentsResolvers');
const { contentsTypeDefs } = require('./components/contents/contentsTypeDefs');

var properties = propertiesReader('application.properties');

let port= properties.get('content_server_port');
console.log(contentResolvers);
console.log(contentsTypeDefs);
  
// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const schema = buildSubgraphSchema({typeDefs: contentsTypeDefs, resolvers: contentResolvers});

const server = new ApolloServer({ 
    schema: schema,
    context: ({ req }) => ({
        req,
        /* 
          this is the important bit:
          we extract the needed headers and then 
          set up a customHeaders property on the context object
        */
        customHeaders: {
          headers: req.headers,
        },
      })
});

// The `listen` method launches a web server.
server.listen(port).then(({ url }) => {
  console.log(`🚀  Content service Server ready at ${url}`);
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

