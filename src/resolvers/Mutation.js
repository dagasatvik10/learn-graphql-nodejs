const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { APP_SECRET, getUserId } = require('../utils');

function post(root, args, context, info) {
  const userId = getUserId(context);
  return context.prisma.createLink({
    url: args.url,
    description: args.description,
    postedBy: { connect: { id: userId } },
  });
}

function updateLink(root, args, context, info) {
  const { id, url, description } = args;
  const newData = {};
  if (url) {
    newData.url = url;
  }
  if (description) {
    newData.description = description;
  }
  return context.prisma.updateLink({ data: newData, where: { id } });
}

function deleteLink(root, args, context, info) {
  return context.prisma.deleteLink({ id: args.id });
}

async function vote(root, args, context, info) {
  const userId = getUserId(context);
  const linkId = args.linkId;

  const voteExists = await context.prisma.$exists.vote({ user: { id: userId }, link: { id: linkId } });

  console.log(voteExists);

  if (voteExists) {
    throw new Error(`Already voted for link: ${args.linkId}`);
  }

  return context.prisma.createVote({
    link: { connect: { id: linkId } },
    user: { connect: { id: userId } },
  });
}

async function signup(root, args, context, info) {
  const hashedPassword = await bcrypt.hash(args.password, 10);

  const { password, ...user } = await context.prisma.createUser({ ...args, password: hashedPassword });

  const token = jwt.sign({ userId: user.id }, APP_SECRET);

  return {
    token,
    user,
  };
}

async function login(parent, args, context, info) {
  const { password, ...user } = await context.prisma.user({ email: args.email });
  if (!user) {
    throw new Error('No such user found');
  }

  const valid = await bcrypt.compare(args.password, password);
  if (!valid) {
    throw new Error('Invalid password');
  }

  const token = jwt.sign({ userId: user.id }, APP_SECRET);

  return {
    token,
    user,
  };
}

module.exports = {
  post,
  updateLink,
  deleteLink,
  vote,
  signup,
  login,
};
