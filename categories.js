const { ApolloServer, gql } = require('apollo-server');
const { buildSubgraphSchema } = require ('@apollo/subgraph')

var  propertiesReader  = require('properties-reader')

const { categoryResolvers } = require('./components/categories/categoryResolvers');
const { categoriesTypeDefs } = require('./components/categories/categoriesTypeDefs');

var properties = propertiesReader('application.properties');

let port= properties.get('categories_server_port');
console.log(categoryResolvers);
console.log(categoriesTypeDefs);
  
// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const schema = buildSubgraphSchema({typeDefs: categoriesTypeDefs, resolvers: categoryResolvers})

const server = new ApolloServer({ 
    schema: schema,
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
server.listen(port).then(({ url }) => {
  console.log(`🚀  Category service Server ready at ${url}`);
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

