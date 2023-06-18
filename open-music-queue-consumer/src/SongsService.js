const { Pool } = require('pg');

class SongsService {
  constructor() {
    this._pool = new Pool();
  }

  async getSongsFromPlaylist(playlistId) {
    const query = {
      text: `
        SELECT 
          playlists.id, 
          playlists.name,
          ARRAY_AGG(
            JSON_BUILD_OBJECT(
              'id', songs.id ,
              'title', songs.title,
              'performer', songs.performer
            )
            ORDER BY songs.title ASC
          ) songs
        FROM playlist_songs
        INNER JOIN playlists ON playlist_songs.playlist_id = playlists.id
        INNER JOIN songs ON playlist_songs.song_id = songs.id
        WHERE playlist_id = $1
        GROUP BY playlists.id`,
      values: [playlistId],
    };

    const { rows } = await this._pool.query(query);
    return rows[0];
  }
}

module.exports = SongsService;
