const { subscribe } = require("graphql")

// 受信側のリゾルバ設定
function newLinkSubscribe(parent, args, context) {
  // 非同期でイテレートする
  // NEW_LINKはトリガー名
  return context.pubsub.asyncIterator("NEW_LINK")
}

const newLink = {
  subscribe: newLinkSubscribe,
  resolve: (payload) => {
    return payload
  }
}

module.exports = {
  newLink
}