const sequelize = require("../config/database");

const User = require("./User");
const UsuarioApp = require("./UsuarioApp");
const Establecimiento = require("./Establecimiento");
const Carta = require("./Carta");
const Seccion = require("./Seccion");
const Producto = require("./Producto");
const Plan = require("./Plan");
const Subscription = require("./Subscription");
const PaymentMethod = require("./PaymentMethod");
const Transaction = require("./Transaction");
const AnalyticsEvent = require("./AnalyticsEvent");
const EmailVerificationToken = require("./EmailVerificationToken");
const PasswordResetToken = require("./PasswordResetToken");
const PartnerProfile = require("./PartnerProfile");
const Referral = require("./Referral");
const Commission = require("./Commission");

User.hasMany(Establecimiento, {
  foreignKey: "user_id",
  onDelete: "CASCADE",
});
Establecimiento.belongsTo(User, {
  foreignKey: "user_id",
});

Establecimiento.hasMany(Carta, {
  foreignKey: "establecimiento_id",
  as: "cartas",
  onDelete: "CASCADE",
});
Carta.belongsTo(Establecimiento, {
  foreignKey: "establecimiento_id",
  as: "establecimiento",
});

Carta.hasMany(Seccion, {
  foreignKey: "carta_id",
  as: "secciones",
  onDelete: "CASCADE",
});
Seccion.belongsTo(Carta, {
  foreignKey: "carta_id",
  as: "carta",
});

Seccion.hasMany(Producto, {
  foreignKey: "seccion_id",
  as: "productos",
  onDelete: "CASCADE",
});
Producto.belongsTo(Seccion, {
  foreignKey: "seccion_id",
  as: "seccion",
});

Establecimiento.hasMany(Producto, {
  foreignKey: "establecimiento_id",
  as: "productos",
  onDelete: "CASCADE",
});
Producto.belongsTo(Establecimiento, {
  foreignKey: "establecimiento_id",
  as: "establecimiento",
});

User.hasOne(Subscription, {
  foreignKey: "user_id",
  onDelete: "CASCADE",
});
Subscription.belongsTo(User, {
  foreignKey: "user_id",
});

Plan.hasMany(Subscription, {
  foreignKey: "plan_id",
});
Subscription.belongsTo(Plan, {
  foreignKey: "plan_id",
});

User.hasMany(PaymentMethod, {
  foreignKey: "user_id",
  onDelete: "CASCADE",
});
PaymentMethod.belongsTo(User, {
  foreignKey: "user_id",
});

Subscription.belongsTo(PaymentMethod, {
  foreignKey: "payment_method_id",
});
PaymentMethod.hasMany(Subscription, {
  foreignKey: "payment_method_id",
});

Subscription.hasMany(Transaction, {
  foreignKey: "subscription_id",
  onDelete: "CASCADE",
});
Transaction.belongsTo(Subscription, {
  foreignKey: "subscription_id",
});

User.hasMany(Transaction, {
  foreignKey: "user_id",
  onDelete: "CASCADE",
});

Transaction.belongsTo(User, {
  foreignKey: "user_id",
});


User.hasMany(EmailVerificationToken, {
  foreignKey: "user_id",
  onDelete: "CASCADE",
});
EmailVerificationToken.belongsTo(User, {
  foreignKey: "user_id",
});

User.hasMany(PasswordResetToken, {
  foreignKey: "user_id",
  onDelete: "CASCADE",
});
PasswordResetToken.belongsTo(User, {
  foreignKey: "user_id",
});

Establecimiento.hasMany(AnalyticsEvent, {
  foreignKey: "establecimiento_id",
  onDelete: "CASCADE",
});
AnalyticsEvent.belongsTo(Establecimiento, {
  foreignKey: "establecimiento_id",
});

// =============================
// PARTNER SYSTEM
// =============================

// User → PartnerProfile
User.hasOne(PartnerProfile, {
  foreignKey: "user_id",
  onDelete: "CASCADE",
});
PartnerProfile.belongsTo(User, {
  foreignKey: "user_id",
});

// PartnerProfile → Referral
PartnerProfile.hasMany(Referral, {
  foreignKey: "partner_id",
  onDelete: "CASCADE",
});
Referral.belongsTo(PartnerProfile, {
  foreignKey: "partner_id",
});

// User (client) → Referral
User.hasOne(Referral, {
  foreignKey: "client_user_id",
  onDelete: "CASCADE",
});
Referral.belongsTo(User, {
  foreignKey: "client_user_id",
});

// Referral → Commission
Referral.hasMany(Commission, {
  foreignKey: "referral_id",
  onDelete: "CASCADE",
});
Commission.belongsTo(Referral, {
  foreignKey: "referral_id",
});

// Subscription → Commission
Subscription.hasMany(Commission, {
  foreignKey: "subscription_id",
  onDelete: "CASCADE",
});
Commission.belongsTo(Subscription, {
  foreignKey: "subscription_id",
});

const initDb = async () => {
  await sequelize.authenticate();
};

module.exports = {
  sequelize,
  initDb,
  User,
  UsuarioApp,
  Establecimiento,
  Carta,
  Seccion,
  Producto,
  Plan,
  Subscription,
  PaymentMethod,
  Transaction,
  AnalyticsEvent,
  EmailVerificationToken,
  PasswordResetToken,

  PartnerProfile,
  Referral,
  Commission,
};
