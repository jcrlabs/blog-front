import { gql } from "@apollo/client"

export const GET_POSTS = gql`
  query GetPosts($filter: PostFilterInput, $pagination: PaginationInput) {
    posts(filter: $filter, pagination: $pagination) {
      id
      title
      slug
      summary
      status
      publishedAt
      sourceUrl
      source
      tagNames
      createdAt
    }
  }
`

export const GET_POST = gql`
  query GetPost($slug: String!) {
    post(slug: $slug) {
      id
      title
      slug
      summary
      content
      status
      publishedAt
      sourceUrl
      source
      tagNames
      createdAt
    }
  }
`

export const GET_CATEGORIES = gql`
  query GetCategories {
    categories {
      id
      name
      slug
    }
  }
`
