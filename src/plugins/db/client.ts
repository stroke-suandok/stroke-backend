import {
    ApolloClient,
    DefaultOptions,
    InMemoryCache,
    gql,
} from '@apollo/client';

const defaultOptions: DefaultOptions = {
    watchQuery: {
        fetchPolicy: 'no-cache',
        errorPolicy: 'ignore',
    },
    query: {
        fetchPolicy: 'no-cache',
        errorPolicy: 'all',
    },
    mutate: {
        errorPolicy: 'all',
    },
};

export const client = new ApolloClient({
    uri: process.env.GRAPHQL_ENDPOINT,
    cache: new InMemoryCache(),
    defaultOptions: defaultOptions,
});

export { gql };
