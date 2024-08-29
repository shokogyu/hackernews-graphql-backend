// 誰によって投稿されたのかのリゾルバ
function postedBy(parent, args, context) {
  return context.prisma.link.findUnique({
    where: { id: parent.id }, // LinkのID
  })
    .postedBy() // モデル全体（Linkモデル）ではなく、フィールドにリゾルバを設定する場合は、関数を最後につける
}

function votes(parent, args, context) {
  return context.prisma.link.findUnique({
    where: { id: parent.id },
  })
    .votes()
}

module.exports = {
  postedBy,
  votes
}