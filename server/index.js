const { ApolloServer, gql } = require('apollo-server');

// taken from https://gist.github.com/solenoid/1372386
var mongoObjectId = function () {
  var timestamp = (new Date().getTime() / 1000 | 0).toString(16);
  return timestamp + 'xxxxxxxxxxxxxxxx'.replace(/[x]/g, function() {
      return (Math.random() * 16 | 0).toString(16);
  }).toLowerCase();
};

// The GraphQL schema
const typeDefs = gql`
  type Type1 {
    id: ID!
    hello: String
  }

  type Type2 {
    id: ID!
    foo: String
  }

  union TypesUnion = Type1 | Type2

  type TypeDefinition {
    id: ID!
    type: String
    union: TypesUnion
  }

  type Type3 {
    id: ID!
    types: [TypeDefinition]
  }

  type Query {
    "A simple type for getting started!"
    getType3: Type3
  }
`;

const sampleType1 = {
  id: mongoObjectId(),
  hello: 'world',
  __typename: 'Type1'
}

const sampleType2 = {
  id: mongoObjectId(),
  foo: 'bar',
  __typename: 'Type2'
}

const sampleType3 = {
  id: mongoObjectId(),
  types: [
    {
      id: mongoObjectId(),
      type: 'type1'
    },
    {
      id: mongoObjectId(),
      type: 'type2'
    }
  ]
}

// A map of functions which return data for the schema.
const resolvers = {
  TypeDefinition: {
    union: parent => parent.type === 'type1' ? sampleType1 : sampleType2
  },
  Query: {
    getType3: () => sampleType3,
  },
};
 
const server = new ApolloServer({
  typeDefs,
  resolvers,
});
 
server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});