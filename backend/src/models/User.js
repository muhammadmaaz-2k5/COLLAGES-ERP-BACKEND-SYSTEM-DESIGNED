const { DataTypes } = require("sequelize");
const bcrypt = require("bcryptjs");
const sequelize = require("../config/database");

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    passwordHash: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    roleCode: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "STUDENT",
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    fullName: {
      type: DataTypes.VIRTUAL,
      get() {
        return `${this.firstName} ${this.lastName}`;
      },
    },
    avatarUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    institutionId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    campusId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    studentId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    employeeId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    lastLoginAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: "users",
    timestamps: true,
    hooks: {
      beforeSave: async (user) => {
        if (user.changed("passwordHash") && !user.passwordHash.startsWith("$2a$") && !user.passwordHash.startsWith("$2b$")) {
          const salt = await bcrypt.genSalt(10);
          user.passwordHash = await bcrypt.hash(user.passwordHash, salt);
        }
      },
    },
  }
);

User.prototype.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.passwordHash);
};

User.prototype.toSafeJSON = function () {
  const values = { ...this.get() };
  delete values.passwordHash;
  return values;
};

module.exports = User;
