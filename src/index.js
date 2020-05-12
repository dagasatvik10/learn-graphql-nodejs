const { GraphQLServer } = require('graphql-yoga');
const { prisma } = require('./generated/prisma-client');

const resolvers = {
  Query: {
    info: () => 'This is the api for a hackernews clone',
    feed: (root, args, context, info) => {
      return context.prisma.links();
    },
    link: (parent, args) => links.find((l) => l.id === args.id),
  },

  Mutation: {
    post: (root, args, context, info) => {
      return context.prisma.createLink({
        url: args.url,
        description: args.description,
      });
    },
    updateLink: (root, args, context, info) => {
      const { id, url, description } = args;
      const newData = {};
      if (url) {
        newData.url = url;
      }
      if (description) {
        newData.description = description;
      }
      return context.prisma.updateLink({ data: newData, where: { id } });
    },
    deleteLink: (root, args, context, info) => {
      return context.prisma.deleteLink({ id: args.id });
    },
  },
};

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers,
  context: { prisma },
});

server.start(() => console.log(`Server is running on http://localhost:4000`));
