const NewThreadComment = require('../../../Domains/thread_comments/entities/NewThreadComment');
const AddedThreadComment = require('../../../Domains/thread_comments/entities/AddedThreadComment');
const ThreadCommentsRepository = require('../../../Domains/thread_comments/ThreadCommentsRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const ThreadCommentUseCase = require('../ThreadCommentUseCase');

describe('AddThreadCommentUseCase', () => {
  it('should orchestrating the add thread comment action correctly', async () => {
    // Arrange
    const useCasePayload = {
      content: 'thread comment',
      threadId: 'thread-123',
      owner: 'user-123',
    };

    const expectedAddedComment = new AddedThreadComment({
      id: 'threadcomment-123',
      content: useCasePayload.content,
      threadId: useCasePayload.threadId,
      date: '2023',
      owner: useCasePayload.owner,
    });

    /** creating dependency of use case */
    const mockThreadCommentRepository = new ThreadCommentsRepository();
    const mockThreadRepository = new ThreadRepository();

    /** mocking needed function */
    mockThreadRepository.verifyAvailableThread = jest.fn(() => Promise.resolve());
    mockThreadCommentRepository.addThreadComment = jest.fn()
      .mockImplementation(() => Promise.resolve(
        new AddedThreadComment({
          id: 'threadcomment-123',
          content: useCasePayload.content,
          threadId: useCasePayload.threadId,
          date: '2023-09-17T010:26:00.000Z',
          owner: useCasePayload.owner,
        }),
      ));

    const addThreadCommentUseCase = new ThreadCommentUseCase({
      threadCommentRepository: mockThreadCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Action
    const addedThreadComment = await addThreadCommentUseCase.addThreadComment(useCasePayload);

    // Assert
    expect(addedThreadComment).toStrictEqual(expectedAddedComment);
    expect(mockThreadRepository.verifyAvailableThread).toBeCalledWith(useCasePayload.threadId);
    expect(mockThreadCommentRepository.addThreadComment).toBeCalledWith(
      new NewThreadComment({
        content: useCasePayload.content,
        threadId: useCasePayload.threadId,
        owner: useCasePayload.owner,
      }),
    );
  });
});

describe('DeleteThreadCommentUseCase', () => {
  it('should orchestrating the delete thread comment action correctly', async () => {
    // Arrange
    const useCasePayload = {
      threadcommentId: 'threadcomment-123',
      threadId: 'thread-123',
      owner: 'user-123',
    };
    const expectedOwner = true;

    const mockThreadCommentRepository = new ThreadCommentsRepository();
    const mockThreadRepository = new ThreadRepository();

    // mock dependency
    mockThreadCommentRepository.verifyAvailableThreadCommentInThread = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockThreadCommentRepository.verifyThreadCommentOwner = jest.fn()
      .mockImplementation(() => Promise.resolve(expectedOwner));
    mockThreadCommentRepository.deleteThreadCommentById = jest.fn()
      .mockImplementation(() => Promise.resolve());

    const threadCommentUseCase = new ThreadCommentUseCase({
      threadCommentRepository: mockThreadCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Action
    await threadCommentUseCase.deleteThreadComment(useCasePayload);

    // Assert
    expect(mockThreadCommentRepository.verifyAvailableThreadCommentInThread)
      .toBeCalledWith(useCasePayload.threadcommentId, useCasePayload.threadId);
    expect(mockThreadCommentRepository.verifyThreadCommentOwner)
      .toBeCalledWith(useCasePayload.threadcommentId, useCasePayload.owner);
    expect(mockThreadCommentRepository.deleteThreadCommentById)
      .toBeCalledWith(useCasePayload.threadcommentId);
  });
});
