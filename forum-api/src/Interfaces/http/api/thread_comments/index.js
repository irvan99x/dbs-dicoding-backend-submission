const routes = require('./routes');
const ThreadCommentsHandler = require('./handler');

module.exports = {
  name: 'comments',
  version: '1.0.0',
  register: async (server, { container }) => {
    const commentsHandler = new ThreadCommentsHandler(container);
    server.route(routes(commentsHandler));
  },
};
