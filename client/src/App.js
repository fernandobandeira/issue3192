import React from 'react';
import { ApolloClient, InMemoryCache } from 'apollo-boost';
import { IntrospectionFragmentMatcher } from 'apollo-cache-inmemory'
import { ApolloProvider } from '@apollo/react-hooks';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { useQuery } from '@apollo/react-hooks';
import { createHttpLink } from 'apollo-link-http'
import { gql } from 'apollo-boost';

const fragmentMatcher = new IntrospectionFragmentMatcher({
  introspectionQueryResultData: {
    __schema: {
      types: [
        {
          kind: 'UNION',
          name: 'TypesUnion',
          possibleTypes: [
            { name: 'Type1' },
            { name: 'Type2' }
          ]
        }
      ]
    }
  }
})

const client = new ApolloClient({
  link: createHttpLink({ uri: 'http://localhost:4000' }),
  cache: new InMemoryCache({ fragmentMatcher })
});

function Index() {
  return <h2>Home</h2>;
}

function Type1() {
  const { loading, error, data } = useQuery(gql`
    {
      getType3 {
        id
        types {
          id
          type
          union {
            ... on Type1 {
              id
              hello
            }
          }
        }
      }
    }
  `);
  console.log(data)
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return (
    <>
      <h2>Type1</h2>
      {JSON.stringify(data)}
    </>
  );
}

function Type2() {
  const { loading, error, data } = useQuery(gql`
    {
      getType3 {
        id
        types {
          id
          type
          union {
            ... on Type2 {
              id
              foo
            }
          }
        }
      }
    }
  `);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;
  console.log(data)
  return (
    <>
      <h2>Type2</h2>
      {JSON.stringify(data)}
    </>
  );
}

function App() {
  return (
    <ApolloProvider client={client}>
      <Router>
        <div>
          <nav>
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/type1/">Type1</Link>
              </li>
              <li>
                <Link to="/type2/">Type2</Link>
              </li>
            </ul>
          </nav>

          <Route path="/" exact component={Index} />
          <Route path="/type1/" component={Type1} />
          <Route path="/type2/" component={Type2} />
        </div>
      </Router>
    </ApolloProvider>
  );
}

export default App;
