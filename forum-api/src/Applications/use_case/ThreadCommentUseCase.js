/* eslint-disable max-len */
const NewThreadComment = require('../../Domains/thread_comments/entities/NewThreadComment');
const AddedThreadComment = require('../../Domains/thread_comments/entities/AddedThreadComment');

class ThreadCommentUseCase {
  constructor({ threadCommentRepository, threadRepository }) {
    this._threadCommentRepository = threadCommentRepository;
    this._threadRepository = threadRepository;
  }

  async addThreadComment(useCasePayload) {
    const newComment = new NewThreadComment(useCasePayload);
    await this._threadRepository.verifyAvailableThread(newComment.threadId);
    const addedComment = await this._threadCommentRepository.addThreadComment(newComment);
    return new AddedThreadComment(addedComment);
  }

  async deleteThreadComment(useCasePayload) {
    const { threadcommentId, threadId, owner } = useCasePayload;
    await this._threadCommentRepository.verifyAvailableThreadCommentInThread(threadcommentId, threadId);
    await this._threadCommentRepository.verifyThreadCommentOwner(
      threadcommentId,
      owner,
    );
    await this._threadCommentRepository.deleteThreadCommentById(threadcommentId);
  }
}

module.exports = ThreadCommentUseCase;
