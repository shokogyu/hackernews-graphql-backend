const { ApolloServer, gql } = require("apollo-server")
const fs = require("fs");
const path = require("path");

const { PrismaClient } = require("@prisma/client");
const { getUserId } = require("./utils");

const prisma = new PrismaClient()

// リゾルバ関数
// 定義した型に対した実態（値？）を入れてあげる
// 何かしらの操作を加えることも出来る
const resolvers = {
  Query: {  // [Query]は定義した型名と合わせる
    info: () => "HackerNewsクローン",
    feed: async (parent, args, context) => {
      // linkはモデルの名前
      return context.prisma.link.findMany();
    },
  },

  Mutation: {
    post: (parent, args, context) => {
      const newLink = context.prisma.link.create({
        data: {
          url: args.url,
          description: args.description,
        }
      })
      return newLink;
    }
  },
}

// アポロサーバーをインスタンス化
const server = new ApolloServer({
  typeDefs: fs.readFileSync(path.join(__dirname, "schema.graphql"), "utf-8"), resolvers, context: ({ req }) => {
    // resolver内で使える変数を定義できる
    return {
      ...req,
      prisma,
      userId: req && req.headers.authorization ? getUserId(req) : null,
    }
  }
})

// 定義したスキーマとリゾルバを使って立ち上げる
// command: "node ./src/server.js"
server.listen().then(({ url }) => console.log(`${url}でサーバーを起動中`))