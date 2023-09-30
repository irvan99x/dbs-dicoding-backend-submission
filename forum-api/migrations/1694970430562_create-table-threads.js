exports.shorthands = undefined;

exports.up = (pgm) => {
    pgm.createTable('threads', {
        id: {
            type: 'VARCHAR(50)',
            primaryKey: true,
        },
        title: {
            type: 'TEXT',
            notNull: true,
        },
        body: {
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
    });

    pgm.addConstraint('threads', 'fk_threads.user.id', 'FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE');
};

exports.down = (pgm) => {
    pgm.dropConstraint('threads', 'fk_threads.user.id');
    pgm.dropTable('threads');
};