/* eslint-disable max-len */
const pool = require('../../database/postgres/pool');
const ThreadCommentRepositoryPostgres = require('../ThreadCommentRepositoryPostgres');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadTableTestHelper');
const ThreadCommentsTableTestHelper = require('../../../../tests/ThreadCommentTableTestHelper');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const NewThreadComment = require('../../../Domains/thread_comments/entities/NewThreadComment');
const AddedThreadComment = require('../../../Domains/thread_comments/entities/AddedThreadComment');

describe('ThreadCommentRepositoryPostgres', () => {
  describe('behavior test', () => {
    beforeAll(async () => {
      await UsersTableTestHelper.addUser({ id: 'user-123', username: 'OtherUsername' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
    });

    afterEach(async () => {
      await ThreadCommentsTableTestHelper.cleanTable();
    });

    afterAll(async () => {
      await ThreadCommentsTableTestHelper.cleanTable();
      await ThreadsTableTestHelper.cleanTable();
      await UsersTableTestHelper.cleanTable();
      await pool.end();
    });

    describe('addThreadComment function', () => {
      it('should persist new thread comment and return added thread comment correctly', async () => {
        // arrange
        const newComment = new NewThreadComment({
          content: 'thread content',
          threadId: 'thread-123',
          owner: 'user-123',
        });
        const fakeIdGenerator = () => '123';
        const commentRepositoryPostgres = new ThreadCommentRepositoryPostgres(pool, fakeIdGenerator);

        // action
        const addedComment = await commentRepositoryPostgres.addThreadComment(newComment);
        const comments = await ThreadCommentsTableTestHelper.getThreadCommentById(
          addedComment.id,
        );

        // assert
        expect(addedComment).toStrictEqual(new AddedThreadComment({
          id: 'comment-123',
          content: newComment.content,
          owner: newComment.owner,
        }));
        expect(comments).toHaveLength(1);
      });

      it('should return added thread comment correctly', async () => {
        // arrange
        const newComment = new NewThreadComment({
          content: 'thread content',
          threadId: 'thread-123',
          owner: 'user-123',
        });

        const fakeIdGenerator = () => '123';
        const commentRepositoryPostgres = new ThreadCommentRepositoryPostgres(pool, fakeIdGenerator);

        // action
        const addedComment = await commentRepositoryPostgres.addThreadComment(newComment);

        // assert
        expect(addedComment).toStrictEqual(new AddedThreadComment({
          id: 'comment-123',
          content: newComment.content,
          owner: newComment.owner,
        }));
      });
    });

    describe('verifyThreadCommentOwner function', () => {
      it('should return true when thread comment owner is the same as the payload', async () => {
        const newComment = new NewThreadComment({
          content: 'more content',
          threadId: 'thread-123',
          owner: 'user-123',
        });

        const fakeIdGenerator = () => '123';
        const commentRepositoryPostgres = new ThreadCommentRepositoryPostgres(pool, fakeIdGenerator);

        await commentRepositoryPostgres.addThreadComment(newComment);

        const isCommentOwner = await commentRepositoryPostgres.verifyThreadCommentOwner('comment-123', 'user-123');

        expect(isCommentOwner).toBeTruthy();
      });

      it('should return Authorization error when thread comment owner is not the same as the payload', async () => {
        const newComment = new NewThreadComment({
          content: 'more content',
          threadId: 'thread-123',
          owner: 'user-123',
        });

        const fakeIdGenerator = () => '123';
        const commentRepositoryPostgres = new ThreadCommentRepositoryPostgres(pool, fakeIdGenerator);

        await commentRepositoryPostgres.addThreadComment(newComment);

        await expect(
          commentRepositoryPostgres.verifyThreadCommentOwner('comment-123', 'user-432'),
        ).rejects.toThrowError(AuthorizationError);
      });
    });

    describe('getThreadCommentByThreadId function', () => {
      it('should return all comments from a thread correctly', async () => {
        const threadComment = {
          id: 'comment-123',
          content: 'more and more content',
          date: new Date('2023-01-19T00:00:00.000Z'),
        };

        await ThreadCommentsTableTestHelper.addComment(threadComment);
        const commentRepositoryPostgres = new ThreadCommentRepositoryPostgres(
          pool,
          {},
          {},
        );

        const commentDetails = await commentRepositoryPostgres.getThreadCommentsByThreadId('thread-123');

        expect(commentDetails.map(({ deleted_at: deletedComment, ...otherProperties }) => otherProperties)).toEqual([
          { ...threadComment, username: 'OtherUsername' },
        ]);
      });

      it('should return an empty array when there are no comment for the thread', async () => {
        const commentRepositoryPostgres = new ThreadCommentRepositoryPostgres(
          pool,
          {},
          {},
        );

        const commentDetails = await commentRepositoryPostgres.getThreadCommentsByThreadId(
          'thread-123',
        );
        expect(commentDetails).toStrictEqual([]);
      });
    });

    describe('verifyAvailableThreadCommentInThread function', () => {
      it('should throw NotFoundError when thread is not available', async () => {
        const commentRepositoryPostgres = new ThreadCommentRepositoryPostgres(
          pool,
          {},
          {},
        );

        await expect(
          commentRepositoryPostgres.verifyAvailableThreadCommentInThread('thread-123', 'comment-123'),
        ).rejects.toThrowError(NotFoundError);
      });

      it('should throw NotFoundError when comment is not available', async () => {
        const commentRepositoryPostgres = new ThreadCommentRepositoryPostgres(
          pool,
          {},
          {},
        );

        await expect(
          commentRepositoryPostgres.verifyAvailableThreadCommentInThread('thread-123', 'comment-123'),
        ).rejects.toThrowError(NotFoundError);
      });

      it('should not throw NotFoundError when thread and comment are exist', async () => {
        await ThreadCommentsTableTestHelper.addComment({
          id: 'comment-123',
          content: 'more and more content',
          date: new Date('2023-01-19T00:00:00.000Z'),
        });

        const commentRepositoryPostgres = new ThreadCommentRepositoryPostgres(
          pool,
          {},
          {},
        );

        await expect(
          commentRepositoryPostgres.verifyAvailableThreadCommentInThread(
            'comment-123',
            'thread-123',
          ),
        ).resolves.not.toThrowError(NotFoundError);
      });
    });

    describe('deleteCommentById function', () => {
      it('should throw NotFoundError when comment is not available', async () => {
        const commentRepositoryPostgres = new ThreadCommentRepositoryPostgres(
          pool,
          {},
          {},
        );

        await expect(
          commentRepositoryPostgres.deleteThreadCommentById('comment-123'),
        ).rejects.toThrowError(NotFoundError);
      });

      it('should delete comment correctly', async () => {
        await ThreadCommentsTableTestHelper.addComment({
          id: 'comment-123',
          content: 'more and more content',
          date: new Date('2023-01-19T00:00:00.000Z'),
        });
        const commentRepositoryPostgres = new ThreadCommentRepositoryPostgres(
          pool,
          {},
          {},
        );

        await commentRepositoryPostgres.deleteThreadCommentById('comment-123');

        const comment = await ThreadCommentsTableTestHelper.getThreadCommentById(
          'comment-123',
        );
        expect(comment[0].deleted_at).toBeDefined();
        expect(comment[0].deleted_at).toBeInstanceOf(Date);
      });
    });
  });
});
