exports.shorthands = undefined;

exports.up = (pgm) => {
    pgm.createTable('thread_comments', {
        id: {
            type: 'VARCHAR(50)',
            primaryKey: true,
        },
        thread_id: {
            type: 'VARCHAR(50)',
            notNull: true,
        },
        content: {
            type: 'TEXT',
            notNull: true,
        },
        user_id: {
            type: 'VARCHAR(50)',
            notNull: true,
        },
        created_at: {
            type: 'timestamp',
            notNull: true,
            default: pgm.func('current_timestamp'),
        },
        deleted_at: {
            type: 'timestamp',
            notNull: false,
        },
    });

    pgm.addConstraint('thread_comments', 'fk_thread_comments.user.id', 'FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE');
    pgm.addConstraint('thread_comments', 'fk_thread_comments.thread.id', 'FOREIGN KEY(thread_id) REFERENCES threads(id) ON DELETE CASCADE');
};

exports.down = (pgm) => {
    pgm.dropConstraint('thread_comments', 'fk_thread_comments.user.id');
    pgm.dropConstraint('thread_comments', 'fk_thread_comments.thread.id');
    pgm.dropTable('thread_comments');
};