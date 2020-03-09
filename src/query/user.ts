export const userDataQuery = (username: string): string => (
  `
  query {
    user(login: "${username}") {
      login
      name
      avatarUrl
      followers {
        totalCount
      }
    }
  }
  `
);
