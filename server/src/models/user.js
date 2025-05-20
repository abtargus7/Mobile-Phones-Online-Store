'use strict';

const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const user = sequelize.define('user', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaltValue: DataTypes.UUIDV4
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    role: {
      type: DataTypes.STRING,
      defaultValue: 'user'
    },
    accessToken: DataTypes.STRING
  }, {
    timestamps: true,
    freezeTableName: true
  });

// Hash password before saving 
user.beforeCreate(async (user) => {
    user.password = await bcrypt.hash(user.password, 10);
});

// method to check password
user.prototype.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
};

// Generate Access Token
user.prototype.generateAccessToken = function () {
    return jwt.sign(
        { id: this.id, email: this.email },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
    );
};


  // Define associations here
  user.associate = (models) => {
    models.user.hasMany(models.product, {foreignKey: "createdBy"});
    models.product.belongsTo(models.user, {foreignKey: "createdBy"})
  };

  return user;
};
