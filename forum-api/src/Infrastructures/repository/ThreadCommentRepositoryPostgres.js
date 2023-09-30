const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AddedThreadComment = require('../../Domains/thread_comments/entities/AddedThreadComment');
const ThreadCommentRepository = require('../../Domains/thread_comments/ThreadCommentsRepository');
const { mapCommentDBToModel } = require('../util');

class ThreadCommentRepositoryPostgres extends ThreadCommentRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addThreadComment(newComment) {
    const { content, threadId, owner } = newComment;

    const id = `comment-${this._idGenerator()}`;
    const date = new Date().toISOString();

    const query = {
      text: 'INSERT INTO thread_comments VALUES($1, $2, $3, $4, $5) RETURNING id, content, user_id as owner',
      values: [id, threadId, content, owner, date],
    };

    const { rows } = await this._pool.query(query);

    return new AddedThreadComment({
      ...rows[0],
    });
  }

  async verifyThreadCommentOwner(commentId, ownerId) {
    const query = {
      text: 'SELECT 1 FROM thread_comments WHERE id = $1 AND user_id = $2',
      values: [commentId, ownerId],
    };

    const { rowCount } = await this._pool.query(query);

    if (!rowCount) {
      throw new AuthorizationError(
        'You are not authorized to access this resource',
      );
    }

    return rowCount;
  }

  async getThreadCommentsByThreadId(threadId) {
    const query = {
      text: `SELECT thread_comments.*, users.username
            FROM thread_comments INNER JOIN users
            ON thread_comments.user_id = users.id
            WHERE thread_comments.thread_id = $1
            ORDER BY thread_comments.created_at ASC`,
      values: [threadId],
    };
    const { rows } = await this._pool.query(query);

    return rows.map((comment) => mapCommentDBToModel(comment));
  }

  async verifyAvailableThreadCommentInThread(commentId, threadId) {
    const query = {
      text: 'SELECT 1 FROM thread_comments WHERE id = $1 AND thread_id = $2',
      values: [commentId, threadId],
    };

    const { rowCount } = await this._pool.query(query);

    if (!rowCount) {
      throw new NotFoundError('No comments found in this thread');
    }
  }

  async deleteThreadCommentById(commentId) {
    const date = new Date().toISOString();
    const query = {
      text: 'UPDATE thread_comments SET deleted_at = $1 WHERE id = $2',
      values: [date, commentId],
    };

    const { rowCount } = await this._pool.query(query);

    if (!rowCount) {
      throw new NotFoundError('Comments not Found');
    }
  }
}

module.exports = ThreadCommentRepositoryPostgres;
