module.exports = (userId, type, payload) => {
  const io = require('../server').io;
  const event = { type, payload, ts: new Date() };
  io.to(`user_${userId}`).emit('contextUpdate', event);
};