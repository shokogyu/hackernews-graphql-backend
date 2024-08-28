const { ApolloServer, gql } = require("apollo-server")
const fs = require("fs");
const path = require("path");

// HackerNewsの1つ1つの投稿（本来はDBから取得するが今はハードコーディングを行う）
let links = [
  {
    id: "link-0",
    description: "GraphQLチュートリアルをUdemyで学ぶ",
    url: "www.test.com"
  },
]

// リゾルバ関数
// 定義した型に対した実態（値？）を入れてあげる
// 何かしらの操作を加えることも出来る
const resolvers = {
  Query: {  // [Query]は定義した型名と合わせる
    info: () => "HackerNewsクローン",
    feed: () => links,
  },

  Mutation: {
    post: (parent, args) => {
      let idCount = links.length;
      const link = {
        id: `link-${idCount++}`,
        description: args.description,
        url: args.url
      }

      links.push(link);
      return link
    }
  },
}

// アポロサーバーをインスタンス化
const server = new ApolloServer({
  typeDefs: fs.readFileSync(path.join(__dirname, "schema.graphql"), "utf-8"), resolvers
})

// 定義したスキーマとリゾルバを使って立ち上げる
// command: "node ./src/server.js"
server.listen().then(({ url }) => console.log(`${url}でサーバーを起動中`))