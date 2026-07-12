const { BillingSetting } = require("../models");

const DEFAULT_FREE_MODE_ENABLED = true;
const BILLING_SETTING_ID = 1;

async function getBillingSetting() {
  const [setting] = await BillingSetting.findOrCreate({
    where: { id: BILLING_SETTING_ID },
    defaults: {
      free_mode_enabled: DEFAULT_FREE_MODE_ENABLED,
      updated_by: null
    }
  });

  return setting;
}

async function getBillingMode() {
  const setting = await getBillingSetting();

  return {
    free_mode_enabled: setting.free_mode_enabled,
    payments_enabled: !setting.free_mode_enabled,
    updated_by: setting.updated_by,
    updatedAt: setting.updatedAt
  };
}

async function isFreeModeEnabled() {
  const setting = await getBillingSetting();
  return setting.free_mode_enabled;
}

async function setFreeModeEnabled(enabled, updatedBy = null) {
  const setting = await getBillingSetting();

  setting.free_mode_enabled = enabled;
  setting.updated_by = updatedBy;

  await setting.save();

  return getBillingMode();
}

module.exports = {
  getBillingMode,
  isFreeModeEnabled,
  setFreeModeEnabled
};
