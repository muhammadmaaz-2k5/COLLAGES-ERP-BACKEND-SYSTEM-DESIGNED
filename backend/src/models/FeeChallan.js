const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const FeeChallan = sequelize.define(
  "FeeChallan",
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    challanNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    studentId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    semesterName: {
      type: DataTypes.STRING,
      defaultValue: "Fall 2026",
    },
    termCode: {
      type: DataTypes.STRING,
      defaultValue: "FA26",
    },
    tuitionFee: {
      type: DataTypes.FLOAT,
      defaultValue: 2500,
    },
    labFee: {
      type: DataTypes.FLOAT,
      defaultValue: 300,
    },
    libraryFee: {
      type: DataTypes.FLOAT,
      defaultValue: 150,
    },
    lateFee: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },
    discountAmount: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },
    totalAmount: {
      type: DataTypes.FLOAT,
      defaultValue: 2950,
    },
    paidAmount: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },
    dueDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("PAID", "PARTIAL", "UNPAID", "OVERDUE", "WAIVED"),
      defaultValue: "UNPAID",
    },
    paymentMethod: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    transactionRef: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    paidAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: "fee_challans",
    timestamps: true,
  }
);

module.exports = FeeChallan;
