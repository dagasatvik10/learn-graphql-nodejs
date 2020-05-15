function info() {
  return 'This is the api for a hackernews clone';
}

function feed(root, args, context, info) {
  return context.prisma.links();
}

function link(root, args, context, info) {
  return context.prisma.link({ id: args.id });
}

module.exports = {
  info,
  feed,
  link,
};
