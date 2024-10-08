const { ApolloServer, gql } = require("apollo-server")
const fs = require("fs");
const path = require("path");

const { PrismaClient } = require("@prisma/client");
const { getUserId } = require("./utils");

const Query = require('./resolvers/Query')
const Mutation = require('./resolvers/Mutation')
const Subscription = require('./resolvers/Subscription')
const Link = require('./resolvers/Link')
const User = require('./resolvers/User')
const Vote = require('./resolvers/Vote')

// サブスクリプションの実装
// Publisher（送信者）/Subscripber（受信者）
const { PubSub } = require('apollo-server')

const prisma = new PrismaClient()
const pubsub = new PubSub()

// リゾルバ関数
// 定義した型に対した実態（値？）を入れてあげる
// 何かしらの操作を加えることも出来る
const resolvers = {
  Query,
  Mutation,
  Subscription,
  Link,
  User,
  Vote,
}

// アポロサーバーをインスタンス化
const server = new ApolloServer({
  typeDefs: fs.readFileSync(path.join(__dirname, "schema.graphql"), "utf-8"), resolvers, context: ({ req }) => {
    // resolver内で使える変数を定義できる
    return {
      ...req,
      prisma,
      pubsub,
      userId: req && req.headers.authorization ? getUserId(req) : null,
    }
  }
})

// 定義したスキーマとリゾルバを使って立ち上げる
// command: "node ./src/server.js"
server.listen().then(({ url }) => console.log(`${url}でサーバーを起動中`))