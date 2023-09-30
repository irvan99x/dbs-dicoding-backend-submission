const ThreadCommentUseCase = require('../../../../Applications/use_case/ThreadCommentUseCase');

class ThreadCommentsHandler {
  constructor(container) {
    this._container = container;

    this.postCommentHandler = this.postCommentHandler.bind(this);
    this.deleteCommentHandler = this.deleteCommentHandler.bind(this);
  }

  async postCommentHandler(request, h) {
    const addCommentUseCase = this._container.getInstance(ThreadCommentUseCase.name);
    const addedComment = await addCommentUseCase.addThreadComment({
      content: request.payload.content,
      threadId: request.params.threadId,
      owner: request.auth.credentials.id,
    });

    const response = h.response({
      status: 'success',
      data: {
        addedComment,
      },
    });
    response.code(201);
    return response;
  }

  async deleteCommentHandler({ params, auth }) {
    const useCasePayload = {
      threadcommentId: params.commentId,
      threadId: params.threadId,
      owner: auth.credentials.id,
    };

    const deleteComment = this._container.getInstance(
      ThreadCommentUseCase.name,
    );
    await deleteComment.deleteThreadComment(useCasePayload);

    return {
      status: 'success',
    };
  }
}

module.exports = ThreadCommentsHandler;
