const { ApolloServer, gql } = require('apollo-server');

// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
const typeDefs = gql`
  # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.

  # This "Book" type defines the queryable fields for every book in our data source.
  type Categories {
    offset: Int!
    count: Int!
    total: Int!
    exists: Boolean!
    results: [Category]
  }

  type Category {
    id: String!
    key: String
    version: Int!
    ancestors: [Category!]!
    parent: Category
    orderHint: String!
    externalId: String
    createdAt: String!
    lastModifiedAt: String!
    children:[Category!]
    name(locale: String!):String
    active:String
    content:Content
  }

  type Contents {
    offset: Int!
    count: Int!
    total: Int!
    exists: Boolean!
    results: [Content!]
    
  }

  type Content {
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
  type Query {
    categories: Categories
    contents: Contents
    content(key: String!) : Content
  }
`;



  module.exports={typeDefs};