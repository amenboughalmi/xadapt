// backend/utils/overrides.js   (new file)
const userOverrides = new Map(); // userId → overrides object

module.exports = {
  getOverrides: (userId) => userOverrides.get(userId) || {},
  setOverride: (userId, type, value, reason = 'manual') => {
    const overrides = userOverrides.get(userId) || {};
    overrides[type] = { value, reason, at: new Date() };
    userOverrides.set(userId, overrides);
  },
  clearOverride: (userId, type) => {
    const overrides = userOverrides.get(userId);
    if (overrides) {
      delete overrides[type];
      if (Object.keys(overrides).length === 0) userOverrides.delete(userId);
    }
  },
  clearAll: (userId) => userOverrides.delete(userId)
};