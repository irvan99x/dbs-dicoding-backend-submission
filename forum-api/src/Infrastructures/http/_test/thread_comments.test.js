/* eslint-disable max-len */
const pool = require('../../database/postgres/pool');
const CommentsTableTestHelper = require('../../../../tests/ThreadCommentTableTestHelper');
const container = require('../../container');
const createServer = require('../createServer');

describe('/threads endpoint', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
  });

  describe('when POST /threads/{threadId}/comments', () => {
    it('should response 201 and persisted comment', async () => {
      const server = await createServer(container);

      // get access token dan user id
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'dicoding',
          password: 'secret',
          fullname: 'Dicoding Indonesia',
        },
      });

      const loginResponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'dicoding',
          password: 'secret',
        },
      });
      const { data: { accessToken } } = JSON.parse(loginResponse.payload);

      const addThreadResponse = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: {
          title: 'thread title',
          body: 'thread body',
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const { data: { addedThread } } = JSON.parse(addThreadResponse.payload);
      const requestPayload = {
        content: 'coba konten',
      };

      const response = await server.inject({
        method: 'POST',
        url: `/threads/${addedThread.id}/comments`,
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedComment).toBeDefined();
    });

    it('should response 400 when request payload not contain needed property', async () => {
      const server = await createServer(container);
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'barbarian',
          password: 'secret',
          fullname: 'Barbarian King',
        },
      });

      const loginResponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'barbarian',
          password: 'secret',
        },
      });
      const { data: { accessToken } } = JSON.parse(loginResponse.payload);

      const addThreadResponse = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: {
          title: 'coba title',
          body: 'coba body',
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const { data: { addedThread } } = JSON.parse(addThreadResponse.payload);

      const requestPayload = {};

      const response = await server.inject({
        method: 'POST',
        url: `/threads/${addedThread.id}/comments`,
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat membuat comment baru karena properti yang dibutuhkan tidak ada');
    });

    it('should response 400 when request payload not meet data type specification', async () => {
      const server = await createServer(container);
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'raiden',
          password: 'secret',
          fullname: 'Raiden Shogun',
        },
      });

      const loginResponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'raiden',
          password: 'secret',
        },
      });
      const { data: { accessToken } } = JSON.parse(loginResponse.payload);

      const addThreadResponse = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: {
          title: 'coba title',
          body: 'coba body',
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const { data: { addedThread } } = JSON.parse(addThreadResponse.payload);

      const requestPayload = {
        content: 1234,
      };

      const response = await server.inject({
        method: 'POST',
        url: `/threads/${addedThread.id}/comments`,
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat membuat comment baru karena tipe data tidak sesuai');
    });

    it('should response 400 when thread id not found', async () => {
      const server = await createServer(container);
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'dicoding',
          password: 'secret',
          fullname: 'Dicoding Indonesia',
        },
      });

      const loginResponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'dicoding',
          password: 'secret',
        },
      });
      const { data: { accessToken } } = JSON.parse(loginResponse.payload);

      const requestPayload = {
        content: 'tes komen thread',
      };

      const response = await server.inject({
        method: 'POST',
        url: '/threads/11/comments',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('Thread not Found');
    });
  });

  describe('when DELETE /threads/{threadId}/comments/{commentId}', () => {
    it('should response 200 if request correct', async () => {
      const server = await createServer(container);
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'dicoding',
          password: 'secret',
          fullname: 'fullname',
        },
      });

      const loginResponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'dicoding',
          password: 'secret',
        },
      });
      const { data: { accessToken } } = JSON.parse(loginResponse.payload);

      const addThreadResponse = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: {
          title: 'thread title',
          body: 'thread body',
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const { data: { addedThread } } = JSON.parse(addThreadResponse.payload);

      const addCommentResponse = await server.inject({
        method: 'POST',
        url: `/threads/${addedThread.id}/comments`,
        payload: { content: 'komen thread' },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const { data: { addedComment } } = JSON.parse(addCommentResponse.payload);

      const deleteCommentResponse = await server.inject({
        method: 'DELETE',
        url: `/threads/${addedThread.id}/comments/${addedComment.id}`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const responseJson = JSON.parse(deleteCommentResponse.payload);
      expect(deleteCommentResponse.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
    });

    it('should response 403 if user is not the comment\'s owner', async () => {
      const server = await createServer(container);

      // owner account
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'ayato',
          password: 'secret',
          fullname: 'Kamisato Ayato',
        },
      });

      const ownerloginResponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'ayato',
          password: 'secret',
        },
      });
      const { data: { accessToken: ownerAccessToken } } = JSON.parse(ownerloginResponse.payload);

      const addThreadResponse = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: {
          title: 'coba title',
          body: 'coba body',
        },
        headers: {
          Authorization: `Bearer ${ownerAccessToken}`,
        },
      });
      const { data: { addedThread } } = JSON.parse(addThreadResponse.payload);

      const addCommentResponse = await server.inject({
        method: 'POST',
        url: `/threads/${addedThread.id}/comments`,
        payload: { content: 'coba konten' },
        headers: {
          Authorization: `Bearer ${ownerAccessToken}`,
        },
      });
      const { data: { addedComment } } = JSON.parse(addCommentResponse.payload);

      // non-owner account
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'ayaka',
          password: 'secret',
          fullname: 'Kamisato Ayaka',
        },
      });

      const nonOwnerloginResponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'ayaka',
          password: 'secret',
        },
      });
      const {
        data: { accessToken: nonOwnerAccessToken },
      } = JSON.parse(nonOwnerloginResponse.payload);

      const deleteCommentResponse = await server.inject({
        method: 'DELETE',
        url: `/threads/${addedThread.id}/comments/${addedComment.id}`,
        headers: {
          Authorization: `Bearer ${nonOwnerAccessToken}`,
        },
      });

      const responseJson = JSON.parse(deleteCommentResponse.payload);
      expect(deleteCommentResponse.statusCode).toEqual(403);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('You are not authorized to access this resource');
    });

    it('should response 404 if the thread or comment not found', async () => {
      const server = await createServer(container);
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'Xiao',
          password: 'secret',
          fullname: 'Xiaoooo',
        },
      });

      const loginResponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'Xiao',
          password: 'secret',
        },
      });
      const { data: { accessToken } } = JSON.parse(loginResponse.payload);

      const addThreadResponse = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: {
          title: 'coba title',
          body: 'coba body',
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const { data: { addedThread } } = JSON.parse(addThreadResponse.payload);

      const addCommentResponse = await server.inject({
        method: 'POST',
        url: `/threads/${addedThread.id}/comments`,
        payload: { content: 'coba konten' },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const { data: { addedComment } } = JSON.parse(addCommentResponse.payload);

      const deleteCommentResponse = await server.inject({
        method: 'DELETE',
        url: `/threads/${addedComment.thread}/comments/comment-random-id`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(deleteCommentResponse.payload);
      expect(deleteCommentResponse.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('No comments found in this thread');
    });
  });
});
