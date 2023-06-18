const autoBind = require('auto-bind');
const ClientError = require('../../exceptions/ClientError');

class AlbumsHandler {
  constructor(service, likeService, storageService, validator) {
    this._service = service;
    this._likeService = likeService;
    this._storageService = storageService;
    this._validator = validator;

    autoBind(this);
  }

  async postAlbumHandler({ payload }, h) {
    try {
      this._validator.validateAlbumPayload(payload);

      const albumId = await this._service.addAlbum(payload);

      const response = h.response({
        status: 'success',
        data: {
          albumId,
        },
      });
      response.code(201);
      return response;
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }

      // Server ERROR!
      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }

  async getAlbumByIdHandler({ params }, h) {
    try {
      const album = await this._service.getAlbumById(params.id);

      return {
        status: 'success',
        data: {
          album,
        },
      };
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }

      // Server ERROR!
      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }

  async putAlbumByIdHandler({ params, payload }, h) {
    try {
      this._validator.validateAlbumPayload(payload);

      const { id: albumId } = params;
      await this._service.editAlbumById(albumId, payload);
      return {
        status: 'success',
        message: 'album berhasil diperbarui',
      };
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }

      // Server ERROR!
      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }

  async deleteAlbumByIdHandler({ params }, h) {
    try {
      await this._service.deleteAlbumById(params.id);

      return {
        status: 'success',
        message: 'album berhasil dihapus',
      };
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }

      // Server ERROR!
      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }

  async postCoverImageHandler({ params, payload }, h) {
    try {
      const { id: albumId } = params;
      const { cover } = payload;

      this._validator.validateCoverHeaders(cover.hapi.headers);

      const albumCover = await this._service.getAlbumCoverById(albumId);
      const filename = await this._storageService.writeFile(cover, cover.hapi);

      if (albumCover) await this._storageService.deleteFile(albumCover);

      const url = `http://${process.env.HOST}:${process.env.PORT}/albums/covers/${filename}`;
      await this._service.addAlbumCover(albumId, url);

      const response = h.response({
        status: 'success',
        message: 'Sampul berhasil diunggah',
      });
      response.code(201);
      return response;
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }

      // Server ERROR!
      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }

  async postAlbumLikeHandler({ params, auth }, h) {
    try {
      const { id: albumId } = params;
      const { userId } = auth.credentials;

      await this._service.verifyAlbumAvailability(albumId);

      await this._likeService.addAlbumLike(userId, albumId);

      const response = h.response({
        status: 'success',
        message: 'menyukai album',
      });
      response.code(201);
      return response;
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }

      // Server ERROR!
      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }

  async deleteAlbumLikeHandler({ params, auth }, h) {
    try {
      const { id: albumId } = params;
      const { userId } = auth.credentials;

      await this._service.verifyAlbumAvailability(albumId);

      await this._likeService.deleteAlbumLike(userId, albumId);

      const response = h.response({
        status: 'success',
        message: 'batal menyukai album',
      });
      response.code(200);
      return response;
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }

      // Server ERROR!
      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }

  async getNumberOfLikeHandler({ params }, h) {
    try {
      const { id } = params;

      await this._service.verifyAlbumAvailability(id);
      const { likes, source } = await this._likeService.getAlbumLikeCount(id);

      const response = h.response({
        status: 'success',
        data: {
          likes: Number(likes),
        },
      });
      response.header('X-Data-Source', source);
      response.code(200);
      return response;
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }

      // Server ERROR!
      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }
}

module.exports = AlbumsHandler;
