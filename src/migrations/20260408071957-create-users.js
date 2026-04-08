'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Enable UUID extension (Postgres)
    await queryInterface.sequelize.query(
      'CREATE EXTENSION IF NOT EXISTS "pgcrypto";'
    );

    // Create ENUM
    await queryInterface.sequelize.query(
      `DO $$ BEGIN
        CREATE TYPE "enum_users_status" AS ENUM ('active', 'inactive', 'suspended');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;`
    );

    // Create Table
    await queryInterface.createTable('users', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal('gen_random_uuid()'),
        primaryKey: true,
      },

      // Basic Info
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

      // Auth
      password: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      is_email_verified: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },

      // RBAC
      role_id: {
        type: Sequelize.UUID,
        references: {
          model: 'roles',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },

      // Profile
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

      // Multi-tenant
      sponsor_id: {
        type: Sequelize.UUID,
        references: {
          model: 'sponsors',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },

      // Security
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

      // Status
      status: {
        type: Sequelize.ENUM('active', 'inactive', 'suspended'),
        defaultValue: 'active',
      },

      // OTP
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

      // Audit
      created_by: {
        type: Sequelize.UUID,
        references: {
          model: 'users',
          key: 'id',
        },
        onDelete: 'SET NULL',
      },
      updated_by: {
        type: Sequelize.UUID,
        references: {
          model: 'users',
          key: 'id',
        },
        onDelete: 'SET NULL',
      },

      // Timestamps
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

    // Indexes
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