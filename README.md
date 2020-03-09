# Github Fetch Users

## Installation
- Clone this repository
- Install dependencies by running `yarn` (or `npm i` if you uses npm)
- Create a `.env` file in the root directory and copy the contents of .env.default to the new `.env` file.
- Follow [this](https://help.github.com/en/github/authenticating-to-github/creating-a-personal-access-token-for-the-command-line) guide to generate a github token, copy the token and set the value of `GITHUB_API_KEY` in your .env file as the token. Ensure both the `repo` and `user` scope are selected when creating the token.
- Run `yarn run dev` to spin up the development server.

## Packaging and Deployment
#### 1. Run with docker-compose

```
$ docker-compose up
```

#### 2. Run with docker

```
$ docker build -t api-server .
$ docker run -t -i -p 3000:3000 api-server
```
## Usage and API docs

The server api contains a single endpoint for seaching github users based on programming language and username, the endpoint is

```
/search?language=[string]&username=[string]
```
##### Params descriptions

1. `language`: one or more comma separated programming languages, The primary language should be the first if more than one language is provided. Other languages provided will be used as fallback if no result is return for the primary language.

2. `username`: The guthub username of the user.

Both query params, `language` and `username` are required, the api will return a validation error if either is not provided.
