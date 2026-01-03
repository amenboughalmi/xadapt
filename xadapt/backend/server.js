require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const sequelize = require('./config/database');
const contextRoutes = require('./routes/context');
const eventRoutes = require('./routes/events');
const manualRoutes = require('./routes/manual');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

// ---------- Middleware ----------
app.use(cors());
app.use(express.json());

// ---------- DB ----------
sequelize.sync()
  .then(() => console.log('MySQL connected and synced'))
  .catch(err => console.error('Database sync error:', err));

// ---------- Export io for utils ----------
module.exports.io = io;

// ---------- Socket.io Auth (query param) ----------
io.use((socket, next) => {
  const token = socket.handshake.query?.token;   // ← THIS LINE

  if (!token) {
    console.log('WS rejected – no token in query');
    return next(new Error('Authentication error: token required in ?token=…'));
  }

  try {
    const decoded = require('jsonwebtoken').verify(token, process.env.JWT_SECRET);
    socket.userId = decoded.id;
    console.log('WS authenticated (query) →', socket.userId);
    next();
  } catch (err) {
    console.log('Invalid token (query):', err.message);
    return next(new Error('Invalid token'));
  }
});

io.on('connection', (socket) => {
  const userId = socket.userId;
  if (!userId) { socket.disconnect(true); return; }

  socket.join(`user_${userId}`);
  console.log('WebSocket connected:', socket.id, 'User:', userId);

  socket.on('disconnect', () => console.log('WS disconnected:', socket.id));
});

// ---------- Routes ----------
const authRoutes = require('./routes/auth');
const simulatorRoutes = require('./routes/simulator');
const automationRoutes = require('./routes/automation');
const deviceRoutes = require('./routes/devices');
const thresholdRoutes = require('./routes/thresholds');
const exportRoutes = require('./routes/export');
const sceneRoutes = require('./routes/scenes');

app.use('/auth', authRoutes);
app.use('/simulator', simulatorRoutes);
app.use('/context', contextRoutes);
app.use('/events', eventRoutes);
app.use('/manual', manualRoutes);
app.use('/automation', automationRoutes);
app.use('/devices', deviceRoutes);
app.use('/thresholds', thresholdRoutes);
app.use('/export', exportRoutes);
app.use('/scenes', sceneRoutes);

app.get('/health', (req, res) => res.json({ status: 'ok' }));

// ---------- Start ----------
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server listening on ${PORT}`));