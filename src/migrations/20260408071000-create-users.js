'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Create ENUM for status
    await queryInterface.sequelize.query(
      `DO $$ BEGIN
        CREATE TYPE "enum_users_status" AS ENUM ('active', 'inactive', 'suspended');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;`
    );

    await queryInterface.createTable('users', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      first_name: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      last_name: {
        type: Sequelize.STRING(100),
      },
      email: {
        type: Sequelize.STRING(255),
        allowNull: false,
        unique: true,
      },
      country_code: {
        type: Sequelize.STRING(10),
      },
      mobile: {
        type: Sequelize.STRING(20),
      },
      password: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      is_email_verified: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      role_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'roles',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      dob: {
        type: Sequelize.DATE,
      },
      country: {
        type: Sequelize.STRING(100),
      },
      city: {
        type: Sequelize.STRING(100),
      },
      address: {
        type: Sequelize.TEXT,
      },
      pincode: {
        type: Sequelize.STRING(20),
      },
      profile_image: {
        type: Sequelize.TEXT,
      },
      sponsor_id: {
        type: Sequelize.INTEGER,
      },
      last_login: {
        type: Sequelize.DATE,
      },
      login_attempts: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      is_locked: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      status: {
        type: Sequelize.ENUM('active', 'inactive', 'suspended'),
        defaultValue: 'active',
      },
      otp_code: {
        type: Sequelize.STRING(10),
      },
      otp_expiry: {
        type: Sequelize.DATE,
      },
      is_otp_verified: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      created_by: {
        type: Sequelize.INTEGER,
        references: {
          model: 'users',
          key: 'id',
        },
        onDelete: 'SET NULL',
      },
      updated_by: {
        type: Sequelize.INTEGER,
        references: {
          model: 'users',
          key: 'id',
        },
        onDelete: 'SET NULL',
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      deleted_at: {
        type: Sequelize.DATE,
      },
    });

    // Add indexes
    await queryInterface.addIndex('users', ['email']);
    await queryInterface.addIndex('users', ['role_id']);
    await queryInterface.addIndex('users', ['sponsor_id']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('users');
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_users_status";'
    );
  },
};
