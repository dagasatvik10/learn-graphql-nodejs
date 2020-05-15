const { prisma } = require('../generated/prisma-client');

function info() {
  return 'This is the api for a hackernews clone';
}

async function feed(root, args, context, info) {
  const where = args.filter
    ? {
        OR: [{ description_contains: args.filter }, { url_contains: args.filter }],
      }
    : {};

  const links = await context.prisma.links({ where, skip: args.skip, first: args.limit, orderBy: args.orderBy });
  const count = prisma
    .linksConnection({ where })
    .aggregate()
    .count();
  return { links, count };
}

function link(root, args, context, info) {
  return context.prisma.link({ id: args.id });
}

module.exports = {
  info,
  feed,
  link,
};
