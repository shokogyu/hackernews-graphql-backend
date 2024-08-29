const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { APP_SECRET, getUserId } = require('../utils')

// ユーザーの新規登録のリゾルバ
async function signup(parent, args, context) {
  // パスワードの設定
  const password = await bcrypt.hash(args.password, 10)

  // ユーザーの新規作成
  const user = await context.prisma.user.create({
    data: {
      ...args,
      password,
    }
  })

  // ユーザー情報の暗号化（APP_SECRET: サーバーの秘密鍵）
  const token = jwt.sign({ userId: user.id }, APP_SECRET)

  return {
    token,
    user
  }
}

async function login(parent, args, context) {
  // ユーザーを検索
  const user = await context.prisma.user.findUnique({
    where: { email: args.email }
  })

  if (!user) {
    throw new Error(`User Not Found with email: ${args.email}`)
  }

  // パスワードを検証
  const valid = await bcrypt.compare(args.password, user.password)

  if (!valid) {
    throw new Error('Invalid Password')
  }

  const token = jwt.sign({ userId: user.id }, APP_SECRET)

  return {
    token,
    user
  }
}


async function post(parent, args, context) {
  const { userId } = context

  const newLink =
    await context.prisma.link.create({
      data: {
        url: args.url,
        description: args.description,
        postedBy: { connect: { id: userId } }
      }
    })

  // 送信
  context.pubsub.publish("NEW_LINK", newLink)

  return newLink
}
module.exports = {
  signup,
  login,
  post
}