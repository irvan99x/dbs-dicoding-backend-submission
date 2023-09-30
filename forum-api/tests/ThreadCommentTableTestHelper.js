/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const ThreadCommentTableTestHelper = {
  async addComment({
    id = 'threadcomment-123',
    threadId = 'thread-123',
    owner = 'user-123',
    content = 'thread content',
    date = '2023-09-20T12:45:00.000Z',
  }) {
    const query = {
      text: 'INSERT INTO thread_comments VALUES($1, $2, $3, $4, $5)',
      values: [id, threadId, content, owner, date],
    };

    await pool.query(query);
  },

  async getThreadCommentById(id) {
    const query = {
      text: 'SELECT * FROM thread_comments WHERE id = $1',
      values: [id],
    };

    const { rows } = await pool.query(query);

    return rows;
  },

  async cleanTable() {
    await pool.query('DELETE FROM thread_comments WHERE 1=1');
  },
};

module.exports = ThreadCommentTableTestHelper;
