const mapThreadDBToModel = ({
  id,
  title,
  body,
  created_at,
  username,
}) => ({
  id,
  title,
  body,
  date: created_at,
  username,
});

const mapCommentDBToModel = ({
  id,
  content,
  created_at,
  deleted_at,
  username,
}) => ({
  id,
  content,
  date: created_at,
  deleted_at,
  username,
});

module.exports = { mapThreadDBToModel, mapCommentDBToModel };
