const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AddedThread = require('../../Domains/threads/entities/AddedThread');
const ThreadRepository = require('../../Domains/threads/ThreadRepository');
const { mapThreadDBToModel } = require('../util');

class ThreadRepositoryPostgres extends ThreadRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addThread(owner, newThread) {
    const { title, body } = newThread;

    const id = `thread-${this._idGenerator()}`;
    const createdAt = new Date().toISOString();

    const query = {
      text: 'INSERT INTO threads VALUES($1, $2, $3, $4, $5) RETURNING id, title, user_id as owner',
      values: [id, title, body, owner, createdAt],
    };

    const { rows } = await this._pool.query(query);

    return new AddedThread(rows[0]);
  }

  async getThreadByID(threadId) {
    const query = {
      text: `SELECT threads.id,
            threads.title,
            threads.body,
            threads.created_at,
            users.username
            FROM threads
            LEFT JOIN users ON threads.user_id = users.id
            WHERE threads.id = $1`,
      values: [threadId],
    };

    const { rows, rowCount } = await this._pool.query(query);

    if (!rowCount) {
      throw new NotFoundError('Thread not Found');
    }
    return mapThreadDBToModel(rows[0]);
  }

  async verifyAvailableThread(threadId) {
    const query = {
      text: 'SELECT 1 FROM threads WHERE id = $1',
      values: [threadId],
    };

    const { rowCount } = await this._pool.query(query);

    if (!rowCount) {
      throw new NotFoundError('Thread not Found');
    }
  }
}

module.exports = ThreadRepositoryPostgres;
