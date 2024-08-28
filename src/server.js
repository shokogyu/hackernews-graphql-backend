const { ApolloServer, gql } = require("apollo-server")

// HackerNewsの1つ1つの投稿（本来はDBから取得するが今はハードコーディングを行う）
let links = [
  {
    id: "link-0",
    description: "GraphQLチュートリアルをUdemyで学ぶ",
    url: "www.test.com"
  },
]

// GraphQLスキーマ（データ構造）の定義
const typeDefs = gql`
  type Query { # [Query]はアポロで決められている文字列
    # !はnullを許容しない
    info:String!
    feed:[Link]! # array
  }

  type Link {
    id: ID!
    description: String!
    url: String!
  }
`

// リゾルバ関数
// 定義した型に対した実態（値？）を入れてあげる
// 何かしらの操作を加えることも出来る
const resolvers = {
  Query: {  // [Query]は定義した型名と合わせる
    info: () => "HackerNewsクローン",
    feed: () => links,
  }
}

// アポロサーバーをインスタンス化
const server = new ApolloServer({
  typeDefs, resolvers
})

// 定義したスキーマとリゾルバを使って立ち上げる
// command: "node ./src/server.js"
server.listen().then(({ url }) => console.log(`${url}でサーバーを起動中`))