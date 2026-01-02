// backend/utils/state.js
const userState = new Map(); // userId → { temperature: {...}, silentMode: {...}, ... }

module.exports = {
  getState: (userId) => userState.get(userId) || {},
  setState: (userId, type, payload) => {
    const state = userState.get(userId) || {};
    state[type] = { ...payload, updatedAt: new Date() };
    userState.set(userId, state);
  },
  clearState: (userId) => userState.delete(userId)
};