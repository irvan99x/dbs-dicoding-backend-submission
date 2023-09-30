/* eslint-disable max-len */
const pool = require('../../database/postgres/pool');
const container = require('../../container');
const createServer = require('../createServer');
const ThreadTableTestHelper = require('../../../../tests/ThreadTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');

describe('/threads endpoint', () => {
  afterAll(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadTableTestHelper.cleanTable();
    await pool.end();
  });

  describe('when POST /threads', () => {
    it('should response 401 when request missing authentication', async () => {
      // Arrange
      const requestPayload = {
        title: 'thread title',
        body: 'thread body',
      };
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(responseJson.error).toEqual('Unauthorized');
      expect(responseJson.message).toEqual('Missing authentication');
    });

    it('should response 400 when request payload not contain needed property', async () => {
      // Arrange
      const requestPayload = {
        title: 'thread title',
      };
      const server = await createServer(container);

      // get access Token first
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'test',
          password: 'secret',
          fullname: 'Dicoding Indonesia',
        },
      });

      const loginResponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'test',
          password: 'secret',
        },
      });
      const { data: { accessToken } } = JSON.parse(loginResponse.payload);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat menambahkan thread, karena payload tidak sesuai');
    });

    it('should response 400 when request payload not meet data type specification', async () => {
      // Arrange
      const requestPayload = {
        title: 123,
        body: 'thread body',
      };
      const server = await createServer(container);

      // get access Token first
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'abcde',
          password: 'secret',
          fullname: 'ABCDE FGHIJ',
        },
      });

      const loginResponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'abcde',
          password: 'secret',
        },
      });
      const { data: { accessToken } } = JSON.parse(loginResponse.payload);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat menambahkan thread, karena tipe data pada payload tidak sesuai');
    });

    it('should response 201 and persisted thread', async () => {
      // Arrange
      const requestPayload = {
        title: 'abcde fghij',
        body: 'klmno pqrst',
      };
      const server = await createServer(container);

      // get access Token first
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'test',
          password: 'secret',
          fullname: 'Dicoding Indonesia',
        },
      });

      const loginResponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'test',
          password: 'secret',
        },
      });
      const { data: { accessToken } } = JSON.parse(loginResponse.payload);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedThread).toBeDefined();
    });
  });

  describe('when GET /threads/{threadId}', () => {
    it('should response 200 and array of thread', async () => {
      // Arrange
      const threadId = 'thread-123';
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadTableTestHelper.addThread({ id: threadId });
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'GET',
        url: `/threads/${threadId}`,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.thread).toBeDefined();
    });

    it('should throw NotFoundError when thread not found', async () => {
      // Arrange
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'GET',
        url: '/threads/thread-1',
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('Thread not Found');
    });
  });
});
