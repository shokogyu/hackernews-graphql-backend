function feed(parent, args, context) {
  // linkはモデルの名前
  return context.prisma.link.findMany();
}

// allow any files to use this function
module.exports = {
  feed
}