const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/database");

class PartnerProfile extends Model {}

PartnerProfile.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },

    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true
    },

    referral_code: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true
    },

    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    }
  },
  {
    sequelize,
    modelName: "PartnerProfile",
    tableName: "partner_profiles",
    underscored: true
  }
);

module.exports = PartnerProfile;