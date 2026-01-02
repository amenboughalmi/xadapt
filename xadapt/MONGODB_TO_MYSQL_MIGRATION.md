# MongoDB to MySQL Migration Guide

## Overview
This project has been migrated from MongoDB (with Mongoose) to MySQL (with Sequelize ORM).

## Changes Made

### 1. **Dependencies Updated** (`backend/package.json`)
- ❌ Removed: `mongoose` 
- ✅ Added: `sequelize`, `mysql2`, `bcryptjs`, `jsonwebtoken`

### 2. **Database Configuration** (`backend/config/database.js`)
- Created new Sequelize configuration
- Supports environment variables for database connection

### 3. **Models Refactored** (`backend/models/`)
All MongoDB Mongoose schemas converted to Sequelize ORM models:
- `User.js` - User authentication
- `Device.js` - Smart device management
- `AutomationRule.js` - Automation rules with JSON storage
- `ContextEvent.js` - Context events with JSON payload
- `ContextThreshold.js` - Alert thresholds
- `SimulationScene.js` - Simulation scenarios

### 4. **Routes Updated** (`backend/routes/`)
All routes converted from Mongoose to Sequelize queries:
- ✅ `auth.js` - Uses `User.findOne()`, `User.create()`
- ✅ `devices.js` - Uses `Device.findAll()`, `Device.create()`, etc.
- ✅ `automation.js` - Automation rule CRUD operations
- ✅ `events.js` - Event retrieval with pagination
- ✅ `export.js` - CSV/JSON export functionality
- ✅ `thresholds.js` - Threshold management with upsert
- ✅ `scenes.js` - Scene management
- ✅ `context.js` - Context utilities (no DB changes needed)
- ✅ `simulator.js` - Simulator utilities (no DB changes needed)
- ✅ `manual.js` - Manual control (compatible with new models)

### 5. **Server Configuration** (`backend/server.js`)
- Replaced `mongoose.connect()` with `sequelize.sync()`
- Automatic table creation on startup

## Setup Instructions

### 1. Install MySQL Server
```bash
# Windows (using Chocolatey)
choco install mysql

# macOS (using Homebrew)
brew install mysql

# Linux (Ubuntu)
sudo apt-get install mysql-server
```

### 2. Create Database
```bash
mysql -u root -p
CREATE DATABASE xadapt;
EXIT;
```

### 3. Install Dependencies
```bash
cd backend
npm install
```

### 4. Configure Environment Variables
Create `.env` file in backend directory:
```
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=xadapt
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d
PORT=5000
NODE_ENV=development
```

### 5. Run Server
```bash
npm run test  # or: nodemon server.js
```

## Query Pattern Changes

### Before (Mongoose)
```javascript
// Find
const user = await User.findOne({ email });

// Create
const user = new User({ email, password });
await user.save();

// Update
const user = await User.findOneAndUpdate(
  { _id: id },
  { ...data },
  { new: true }
);

// Delete
await User.findOneAndDelete({ _id: id });
```

### After (Sequelize)
```javascript
// Find
const user = await User.findOne({ where: { email } });

// Create
const user = await User.create({ email, password });

// Update
const user = await User.findOne({ where: { id } });
await user.update({ ...data });

// Delete
const user = await User.findOne({ where: { id } });
await user.destroy();

// Count
const count = await User.count({ where: { active: true } });

// FindAll
const users = await User.findAll({ where: { active: true } });
```

## Data Migration (if migrating from existing MongoDB)

If you have existing data in MongoDB that needs to be migrated:

1. Export MongoDB data to JSON:
```bash
mongoexport --db xadapt --collection users --out users.json
```

2. Create migration script (example):
```javascript
// scripts/migrate.js
const sequelize = require('../config/database');
const User = require('../models/User');
const fs = require('fs');

async function migrateUsers() {
  const data = JSON.parse(fs.readFileSync('users.json', 'utf-8'));
  for (const user of data) {
    await User.create({
      email: user.email,
      password: user.password,
      createdAt: new Date(user.createdAt)
    });
  }
}
```

## Key Differences

| Feature | Mongoose | Sequelize |
|---------|----------|-----------|
| **ID Field** | `_id` (ObjectId) | `id` (Integer auto-increment) |
| **Mixed Types** | `mongoose.Schema.Types.Mixed` | `DataTypes.JSON` |
| **Arrays** | Built-in array support | `DataTypes.JSON` |
| **Timestamps** | `{ timestamps: true }` | `sequelize.define(..., { timestamps: true })` |
| **Enum** | `enum: ['value1']` | `DataTypes.ENUM('value1')` |
| **Pagination** | `.skip().limit()` | `offset, limit` |
| **Operators** | `$gte`, `$lte`, `$inc` | `Op.gte`, `Op.lte`, `Op.increment` |

## Troubleshooting

### Connection Issues
```
Error: connect ECONNREFUSED 127.0.0.1:3306
```
- Ensure MySQL is running: `mysql.server start`
- Check credentials in `.env`

### Foreign Key Errors
- Ensure parent records exist before creating child records
- Device requires valid `userId` that exists in User table

### JSON Field Issues
- MySQL JSON fields work seamlessly with Sequelize
- Complex objects are automatically serialized/deserialized

## Environment Variables
See `.env.example` for all available configuration options.

## Frontend Changes
✅ **No changes needed** - API endpoints remain identical
