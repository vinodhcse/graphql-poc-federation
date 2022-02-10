const { ApolloServer, gql } = require('apollo-server');

// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
const contentsTypeDefs = gql`
  # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.

  # This "Book" type defines the queryable fields for every book in our data source.
  type Contents {
    offset: Int!
    count: Int!
    total: Int!
    exists: Boolean!
    results: [Content!]
    
  }

  type Content @key(fields: "id"){
    container: String
    key: String
    value: ContentCustomObject
    id: String
    version: Int
    createdAt: String
    lastModifiedAt: String
    createdBy: String
    lastModifiedBy: String
  }

  type ContentCustomObject {
    name: String
    description: String
    content_url: String
    category:CustomReferenceObject
  }

  type CustomReferenceObject {
    typeId: String
    id: String
  }


  # The "Query" type is special: it lists all of the available queries that
  # clients can execute, along with the return type for each. In this
  # case, the "books" query returns an array of zero or more Books (defined above).
  extend type Query {
    contents: Contents
    content(key: String!) : Content
  }
`;



  module.exports={contentsTypeDefs};