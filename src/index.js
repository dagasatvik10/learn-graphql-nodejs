const { GraphQLServer } = require('graphql-yoga');

let links = [
  {
    id: 'link-0',
    url: 'www.howtographql.com',
    description: 'Fullstack tutorial for GraphQL',
  },
];

let idCount = links.length;

const resolvers = {
  Query: {
    info: () => 'This is the api for a hackernews clone',
    feed: () => links,
    link: (parent, args) => links.find((l) => l.id === args.id),
  },

  Mutation: {
    post: (parent, args) => {
      const link = {
        id: `link-${idCount++}`,
        url: args.url,
        description: args.description,
      };
      links.push(link);
      return link;
    },
    updateLink: (parent, args) => {
      const tempLinks = links.slice();
      const linkIndex = tempLinks.findIndex((l) => l.id === args.id);
      const link = tempLinks[linkIndex];
      if (link) {
        if (args.url) {
          link.url = args.url;
        }
        if (args.description) {
          link.description = args.description;
        }
        tempLinks.splice(linkIndex, 1, link);
        links = tempLinks;
        return link;
      }
    },
    deleteLink: (parent, args) => {
      const tempLinks = links.slice();
      const linkIndex = tempLinks.findIndex((l) => l.id === args.id);
      if (linkIndex || linkIndex === 0) {
        const link = tempLinks[linkIndex];
        tempLinks.splice(linkIndex, 1);
        links = tempLinks;
        return link;
      }
    },
  },
};

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers,
});

server.start(() => console.log(`Server is running on http://localhost:4000`));
