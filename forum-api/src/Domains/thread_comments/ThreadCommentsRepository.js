/* eslint-disable no-unused-vars */
class ThreadCommentRepository {
  async addThreadComment(newComment) {
    throw new Error('THREAD_COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async verifyThreadCommentOwner(id, owner) {
    throw new Error('THREAD_COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async deleteThreadCommentById(id) {
    throw new Error('THREAD_COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async getThreadCommentsByThreadId(threadId) {
    throw new Error('THREAD_COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async verifyAvailableThreadCommentInThread(id, threadId) {
    throw new Error('THREAD_COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }
}

module.exports = ThreadCommentRepository;
