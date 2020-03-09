export const searchQuery = (user: string, language: string): string => (
  `
  query {
    search(query: "language:${language} user:${user} is:public", type: REPOSITORY, first: 10) {
      nodes {
        ... on Repository {
          nameWithOwner
          owner {
            login
          }
          languages(first: 5, orderBy: {field: SIZE, direction: DESC}) {
            nodes {
              name
            }
          }
        }
      }
    }
  }
`
);
