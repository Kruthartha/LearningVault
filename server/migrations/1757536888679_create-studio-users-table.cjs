/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
exports.shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | Promise<void>}
 * @returns {Promise<void> | void}
 */
exports.up = (pgm) => {
  // 1. CREATE THE REUSABLE FUNCTION FOR UPDATING TIMESTAMPS
  // This function must be created before any triggers can use it.
  pgm.sql(`
    CREATE OR REPLACE FUNCTION trigger_set_timestamp()
    RETURNS TRIGGER AS $$
    BEGIN
      NEW.updated_at = NOW();
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;
  `);

  // 2. Create a custom type for different admin roles
  pgm.createType('studio_user_role', ['Super Admin', 'Content Creator', 'Moderator']);

  // 3. Create the main studio_users table
  pgm.createTable('studio_users', {
    id: { type: 'uuid', primaryKey: true, default: pgm.func('gen_random_uuid()') },
    first_name: { type: 'varchar(100)', notNull: true },
    last_name: { type: 'varchar(100)', notNull: true },
    email: { type: 'varchar(100)', notNull: true, unique: true },
    password: { type: 'varchar(255)', notNull: true },
    role: { type: 'studio_user_role', notNull: true, default: 'Content Creator' },
    is_active: { type: 'boolean', default: true },
    password_reset_token: { type: 'varchar(255)' },
    password_reset_expires: { type: 'timestamp with time zone' },
    created_at: {
      type: 'timestamp with time zone',
      notNull: true,
      default: pgm.func('now()'),
    },
    // Add the updated_at column
    updated_at: {
      type: 'timestamp with time zone',
      notNull: true,
      default: pgm.func('now()'),
    },
  });
  
  // 4. APPLY THE TRIGGER TO THE studio_users TABLE
  pgm.createTrigger('studio_users', 'set_timestamp_studio_users', {
    when: 'BEFORE',
    operation: 'UPDATE',
    function: 'trigger_set_timestamp',
    level: 'ROW',
  });

  // 5. Create a separate refresh token table for studio users
  pgm.createTable('studio_refresh_tokens', {
    // Using SERIAL for this table's PK is fine, as it's not exposed publicly.
    id: 'id', 
    user_id: { type: 'uuid', notNull: true, references: '"studio_users"(id)', onDelete: 'cascade' },
    token_hash: { type: 'text', notNull: true },
    expires_at: { type: 'timestamp with time zone', notNull: true },
    revoked: { type: 'boolean', default: false },
    created_at: {
      type: 'timestamp with time zone',
      notNull: true,
      default: pgm.func('now()'),
    }
  });

  pgm.createIndex('studio_refresh_tokens', 'token_hash');
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | Promise<void>}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
  // Drop in reverse order of creation
  pgm.dropTable('studio_refresh_tokens');
  pgm.dropTable('studio_users'); // The trigger is dropped automatically with the table
  pgm.dropType('studio_user_role');

  // Drop the reusable function last
  pgm.sql('DROP FUNCTION IF EXISTS trigger_set_timestamp()');
};