const ThreadCommentsRepository = require('../ThreadCommentsRepository');

describe('a ThreadCommentsRepository interface', () => {
  it('should throw error when invoke abstract behavior', async () => {
    // Arrange
    const threadCommentsRepository = new ThreadCommentsRepository();

    // Action and Assert
    await expect(threadCommentsRepository.addThreadComment({})).rejects.toThrowError(
      'THREAD_COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED',
    );
    await expect(
      threadCommentsRepository.verifyThreadCommentOwner('', ''),
    ).rejects.toThrowError('THREAD_COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(
      threadCommentsRepository.deleteThreadCommentById(''),
    ).rejects.toThrowError('THREAD_COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(
      threadCommentsRepository.getThreadCommentsByThreadId(''),
    ).rejects.toThrowError('THREAD_COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(
      threadCommentsRepository.verifyAvailableThreadCommentInThread(''),
    ).rejects.toThrowError('THREAD_COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });
});
