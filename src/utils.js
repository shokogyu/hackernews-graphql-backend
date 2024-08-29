
const jwt = require('jsonwebtoken')
APP_SECRET = "GraphQL"


// トークンを複合する
function getTokenPayload(token) {
  // トークン化されたものの前の情報（user.id)を複合する
  return jwt.verify(token, APP_SECRET)
}

// ユーザーIDを取得する関数
function getUserId(req, authToken) {
  if (req) {
    // check headers
    const authHeader = req.headers.authorization

    if (authHeader) {
      // Bearerを削除して、tokenデータだけ取得
      const token = authHeader.replace("Bearer", "")

      if (!token) {
        throw new Error('トークンが見つかりませんでした')
      }

      const { userId } = getTokenPayload(token)
      return userId
    }
  } else if (authToken) {
    const { userId } = getTokenPayload(token)
    return userId
  }

  throw new Error('認証権限がありません')
}

module.exports = {
  APP_SECRET,
  getUserId
}