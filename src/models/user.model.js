'use strict';

const { Model } = require('sequelize');
const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // Role
      User.belongsTo(models.Role, {
        foreignKey: 'role_id',
        as: 'role',
      });

      // TODO: Add other associations when models are created
      // Sponsor - will be added when Sponsor model exists
      // Self reference (audit) - will be added when needed
      // Cases assigned - will be added when Case model exists
    }

    // Instance method → compare password
    async validPassword(password) {
      return bcrypt.compare(password, this.password);
    }
  }

  User.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },

      // Basic Info
      first_name: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      last_name: {
        type: DataTypes.STRING(100),
      },
      email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      country_code: {
        type: DataTypes.STRING(10),
      },
      mobile: {
        type: DataTypes.STRING(20),
      },

      // Auth
      password: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      is_email_verified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },

      // RBAC
      role_id: {
        type: DataTypes.INTEGER,
      },

      // Profile
      dob: {
        type: DataTypes.DATE,
      },
      country: {
        type: DataTypes.STRING(100),
      },
      city: {
        type: DataTypes.STRING(100),
      },
      address: {
        type: DataTypes.TEXT,
      },
      pincode: {
        type: DataTypes.STRING(20),
      },
      profile_image: {
        type: DataTypes.TEXT,
      },

      // Multi-tenant
      sponsor_id: {
        type: DataTypes.INTEGER,
      },

      // Security
      last_login: {
        type: DataTypes.DATE,
      },
      login_attempts: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      is_locked: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },

      // Status
      status: {
        type: DataTypes.ENUM('active', 'inactive', 'suspended'),
        defaultValue: 'active',
      },

      // OTP
      otp_code: {
        type: DataTypes.STRING(10),
      },
      otp_expiry: {
        type: DataTypes.DATE,
      },
      is_otp_verified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },

      // Audit
      created_by: {
        type: DataTypes.INTEGER,
      },
      updated_by: {
        type: DataTypes.INTEGER,
      },

      // Soft delete
      deleted_at: {
        type: DataTypes.DATE,
      },
    },
    {
      sequelize,
      modelName: 'User',
      tableName: 'users',
      timestamps: true,
      paranoid: true, // enables soft delete
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      deletedAt: 'deleted_at',
    }
  );

  // 🔐 PASSWORD HASHING HOOK
  User.beforeCreate(async (user) => {
    if (user.password) {
      user.password = await bcrypt.hash(user.password, 10);
    }
  });

  User.beforeUpdate(async (user) => {
    if (user.changed('password')) {
      user.password = await bcrypt.hash(user.password, 10);
    }
  });

  return User;
};