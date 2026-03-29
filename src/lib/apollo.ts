import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client"
import { registerApolloClient } from "@apollo/experimental-nextjs-app-support"

export const { getClient } = registerApolloClient(() => {
  return new ApolloClient({
    cache: new InMemoryCache(),
    link: new HttpLink({
      uri: `${process.env.API_URL ?? "https://tech-blog-api.jcrlabs.net"}/api/graphql`,
    }),
  })
})
