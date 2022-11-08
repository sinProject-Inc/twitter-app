<div align="center">
  <img src="https://sinproject.net/wp-content/uploads/2019/12/sinProject-01-640x677.png" width="400">
  <h1>Twitter App</h1>
  <br />
</div>

## What is Twitter App?

This is a Twitter app.

## Prerequisites

- [MySQL Community Server 8.0.30](https://dev.mysql.com/downloads/mysql/) or higher
- [Node.js](https://nodejs.org/) 18.4.0 or higher
- npm 8.13.2 or higher

### Prerequisites for signing in with Twitter

- [Twitter developer account and setup](https://developer.twitter.com/en/docs/apps/overview)

## Setting up the project

Here are the steps:

1. Get the project and setup:

```bash
# Clone the repo to your current directory
git clone https://github.com/sinProject-Inc/twitter-app.git

# Install the dependencies
cd /twitter-app
npm install
```

2. Create a database named twitter-app
3. Create a .env file by copying .env.example at the top level of the project
4. rewrite the env file:

```env
DATABASE_URL="mysql://user:password@localhost:3306/twitter-app"

TWITTER_CLIENT_ID="{client-id}"
TWITTER_CLIENT_SECRET="{client-secret}"
```

## Run locally

```bash
# Start the server and open the app in a new browser tab
npm run dev -- --open
```

## Feedback

👉 [**Ask a question**](https://github.com/sinProject-Inc/twitter-app/discussions/new)

👉 [**Request a new feature**](https://github.com/sinProject-Inc/twitter-app/issues/new)

👉 [**Upvote popular feature requests**](https://github.com/sinProject-Inc/twitter-app/issues/)

👉 [**Create a bug report**](https://github.com/sinProject-Inc/twitter-app/issues/new)

👉 [**Become a sponsor**](https://github.com/sponsors/sinproject-iwasaki)

## License

Copyright (c) sinProject Inc. All rights reserved.

Licensed under the [MIT](https://github.com/sinProject-Inc/twitter-app/blob/main/LICENSE) license.


