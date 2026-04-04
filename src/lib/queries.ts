export const GET_POSTS = `
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

export const GET_POST = `
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

export const GET_CATEGORIES = `
  query GetCategories {
    categories {
      id
      name
      slug
    }
  }
`

export const LOGIN = `
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      accessToken
      refreshToken
    }
  }
`

export const GET_PENDING_POSTS = `
  query PendingPosts {
    pendingPosts {
      id
      title
      summary
      sourceUrl
      source
      tagNames
      createdAt
    }
  }
`

export const APPROVE_POST = `
  mutation ApprovePost($id: ID!) {
    approvePost(id: $id) { id status }
  }
`

export const REJECT_POST = `
  mutation RejectPost($id: ID!) {
    rejectPost(id: $id) { id status }
  }
`
