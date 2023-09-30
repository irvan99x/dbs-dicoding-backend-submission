const UserThread = require('../../Domains/threads/entities/NewThread');

class ThreadUseCase {
  constructor({ threadRepository, threadCommentRepository }) {
    this._threadRepository = threadRepository;
    this._threadCommentRepository = threadCommentRepository;
  }

  async addThread(request, useCasePayload) {
    const userThread = new UserThread(useCasePayload);
    const addedThread = await this._threadRepository.addThread(request, userThread);
    return addedThread;
  }

  async getThreadByID(threadId) {
    const thread = await this._threadRepository.getThreadByID(threadId);
    let comments = await this._threadCommentRepository.getThreadCommentsByThreadId(
      threadId,
    );
    comments = comments.map((comment) => ({
      id: comment.id,
      username: comment.username,
      date: comment.date,
      content: comment.deleted_at
        ? '**komentar telah dihapus**'
        : comment.content,
    }));

    return {
      ...thread,
      comments,
    };
  }
}

module.exports = ThreadUseCase;
