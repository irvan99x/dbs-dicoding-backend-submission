const ThreadUseCase = require('../../../../Applications/use_case/ThreadUseCase');

class ThreadHandler {
  constructor(container) {
    this._container = container;
    this.postThreadHandler = this.postThreadHandler.bind(this);
    this.getThreadByIdHandler = this.getThreadByIdHandler.bind(this);
  }

  async postThreadHandler({ payload, auth }, h) {
    const usecasePayload = {
      title: payload.title,
      body: payload.body,
    };

    const threadUseCase = this._container.getInstance(ThreadUseCase.name);
    const addedThread = await threadUseCase.addThread(auth.credentials.id, usecasePayload);

    const response = h.response({
      status: 'success',
      message: 'Thread berhasil ditambahkan',
      data: {
        addedThread,
      },
    });
    response.code(201);
    return response;
  }

  async getThreadByIdHandler(request) {
    const threadUseCase = this._container.getInstance(ThreadUseCase.name);
    const thread = await threadUseCase.getThreadByID(request.params.threadId);

    return {
      status: 'success',
      data: {
        thread,
      },
    };
  }
}

module.exports = ThreadHandler;
