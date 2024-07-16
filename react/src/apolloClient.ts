// import {ApolloClient, InMemoryCache} from "@apollo/client";
//
// export const apolloClient = new ApolloClient({
//     uri: 'https://graphqlzero.almansi.me/api',
//     cache: new InMemoryCache(),
// });

import {ApolloClient, InMemoryCache} from "@apollo/client";

export const apolloClient = new ApolloClient({
    uri: 'http://localhost:4000/',
    cache: new InMemoryCache(),
});