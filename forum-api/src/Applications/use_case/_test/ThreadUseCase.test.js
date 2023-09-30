/* eslint-disable max-len */
const UserThread = require('../../../Domains/threads/entities/NewThread');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const ThreadCommentRepository = require('../../../Domains/thread_comments/ThreadCommentsRepository');
const ThreadUseCase = require('../ThreadUseCase');

describe('Add Thread UseCase', () => {
  it('should orchestrating the add user action correctly', async () => {
    // Arrange
    const request = {
      credentialId: 'owner id',
    };
    const useCasePayload = {
      title: 'thread title',
      body: 'thread body',
    };

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();

    /** mocking needed function */
    mockThreadRepository.addThread = jest.fn().mockImplementation(() => Promise.resolve(
      new AddedThread({
        id: 'thread-123',
        title: useCasePayload.title,
        owner: request.credentialId,
      }),
    ));

    /** creating use case instance */
    const threadUseCase = new ThreadUseCase({
      threadRepository: mockThreadRepository,
    });

    // Action
    const addedThread = await threadUseCase.addThread(request, useCasePayload);

    // Assert
    expect(addedThread).toStrictEqual(new AddedThread({
      id: 'thread-123',
      title: useCasePayload.title,
      owner: request.credentialId,
    }));

    expect(mockThreadRepository.addThread).toBeCalledWith(request, new UserThread({
      title: useCasePayload.title,
      body: useCasePayload.body,
    }));
  });
});

describe('Get Thread By ID Use Case', () => {
  it('should orchestrating the get thread by id action correctly', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-123',
    };
    const expectedThreadReturn = {
      id: 'thread-123',
      title: 'more thread title',
      body: 'more thread body',
      date: '2022',
      username: 'dicoding',
    };
    const expectedComments = [
      {
        id: 'comment-123',
        username: 'dicoding',
        date: '2022',
        content: 'more thread content',
      },
    ];

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockThreadCommentRepository = new ThreadCommentRepository();

    /** mocking needed function */
    mockThreadRepository.getThreadByID = jest.fn()
      .mockImplementation(() => Promise.resolve(expectedThreadReturn));
    mockThreadCommentRepository.getThreadCommentsByThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve(expectedComments));

    /** creating use case instance */
    const threadUseCase = new ThreadUseCase({
      threadRepository: mockThreadRepository,
      threadCommentRepository: mockThreadCommentRepository,
    });

    // Action
    const theThread = await threadUseCase.getThreadByID(useCasePayload.threadId);

    // Assert
    expect(theThread).toStrictEqual({
      ...expectedThreadReturn,
      comments: expectedComments.map((comment) => ({
        content: comment.content,
        date: comment.date,
        id: comment.id,
        username: comment.username,
      })),
    });
    expect(mockThreadRepository.getThreadByID).toBeCalledWith(useCasePayload.threadId);
    expect(mockThreadCommentRepository.getThreadCommentsByThreadId).toBeCalledWith(useCasePayload.threadId);
  });

  it('should not display deleted comment', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-123',
    };

    const expectedThread = {
      id: 'thread-123',
      title: 'more thread title',
      body: 'more thread body',
      date: '2022',
      username: 'dicoding',
    };

    const expectedComments = [
      {
        id: 'comment-123',
        username: 'dicoding',
        date: '2022',
        content: '**komentar telah dihapus**',
        deleted_at: '2023-09-17T010:26:00.000Z',
      },
    ];

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockThreadCommentRepository = new ThreadCommentRepository();

    /** mocking needed function */
    mockThreadRepository.getThreadByID = jest.fn()
      .mockImplementation(() => Promise.resolve(expectedThread));
    mockThreadCommentRepository.getThreadCommentsByThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve(expectedComments));

    const mockGetThreadUseCase = new ThreadUseCase({
      threadRepository: mockThreadRepository,
      threadCommentRepository: mockThreadCommentRepository,
    });

    // Action
    const theThread = await mockGetThreadUseCase.getThreadByID(useCasePayload.threadId);

    // Assert
    expect(theThread).toStrictEqual({
      ...expectedThread,
      comments: expectedComments.map(({ deleted_at: deletedComment, ...otherProperties }) => otherProperties),
    });
    expect(mockThreadRepository.getThreadByID).toBeCalledWith(useCasePayload.threadId);
    expect(mockThreadCommentRepository.getThreadCommentsByThreadId).toBeCalledWith(useCasePayload.threadId);
  });
});
