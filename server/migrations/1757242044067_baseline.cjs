exports.up = (pgm) => {
  pgm.createType('coding_level', ['Beginner', 'Intermediate', 'Advanced']);

  pgm.createTable('users', {
    id: 'id',
    first_name: { type: 'varchar(100)', notNull: true },
    last_name: { type: 'varchar(100)', notNull: true },
    email: { type: 'varchar(100)', notNull: true, unique: true },
    password: { type: 'varchar(255)', notNull: true },
    terms_accepted: { type: 'boolean', notNull: true },
    subscribe_updates: { type: 'boolean', default: false },
    otp: { type: 'varchar(6)' },
    otp_expires: { type: 'timestamp' },
    is_verified: { type: 'boolean', default: false },
    created_at: { type: 'timestamp', default: pgm.func('now()') },
    password_reset_token: { type: 'varchar(255)' },
    password_reset_expires: { type: 'timestamp' }
  });

  pgm.createTable('refresh_tokens', {
    id: 'id',
    user_id: { type: 'integer', notNull: true, references: '"users"', onDelete: 'cascade' },
    token_hash: { type: 'text', notNull: true },
    expires_at: { type: 'timestamp', notNull: true },
    revoked: { type: 'boolean', default: false },
    created_at: { type: 'timestamp', default: pgm.func('now()') }
  });

  pgm.createIndex('refresh_tokens', 'token_hash');

  pgm.createTable('user_profiles', {
    id: 'id',
    user_id: { type: 'integer', unique: true, references: '"users"', onDelete: 'cascade' },
    learning_goals: { type: 'text' },
    coding_experience: { type: 'coding_level' },
    learning_track: { type: 'varchar(50)' },
    onboarding_completed: { type: 'boolean', default: false },
    created_at: { type: 'timestamp', default: pgm.func('current_timestamp') },
    updated_at: { type: 'timestamp', default: pgm.func('current_timestamp') }
  });
};

exports.down = (pgm) => {
  pgm.dropTable('user_profiles');
  pgm.dropTable('refresh_tokens');
  pgm.dropTable('users');
  pgm.dropType('coding_level');
};