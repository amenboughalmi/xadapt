# xAdapt - MongoDB to MySQL Migration Complete ✅

## What Changed?

Your xAdapt project has been successfully migrated from **MongoDB** to **MySQL**. All the heavy lifting is done - the database layer, models, and API routes have been completely refactored.

## Quick Start

### 1️⃣ Install Dependencies
```bash
cd backend
npm install
```

### 2️⃣ Setup MySQL

**Option A: Using Homebrew (macOS)**
```bash
brew install mysql
brew services start mysql
mysql -u root
```

**Option B: Using Windows**
- Download MySQL installer from https://dev.mysql.com/downloads/mysql/
- Run installer and follow wizard
- Keep default settings

**Option C: Using Docker**
```bash
docker run --name mysql-xadapt -e MYSQL_ROOT_PASSWORD=root -p 3306:3306 -d mysql:latest
```

### 3️⃣ Configure Environment
Create `.env` in the `backend` folder:
```
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=root
DB_NAME=xadapt
JWT_SECRET=your_secret_key_12345
JWT_EXPIRES_IN=7d
PORT=5000
NODE_ENV=development
```

### 4️⃣ Initialize Database
```bash
npm run init-db
```
This will:
- Create the `xadapt` database
- Create all tables automatically
- Verify connection

### 5️⃣ Start Server
```bash
npm run test    # with auto-reload
# or
npm start       # production mode
```

## What Was Updated

| File/Folder | Changes |
|------------|---------|
| `package.json` | ✅ Added sequelize, mysql2, bcryptjs, jsonwebtoken |
| `config/database.js` | ✅ NEW - Sequelize MySQL connection config |
| `models/*.js` | ✅ All 6 models converted to Sequelize ORM |
| `routes/*.js` | ✅ All routes updated for Sequelize queries |
| `server.js` | ✅ Uses sequelize.sync() instead of mongoose.connect() |
| `.env.example` | ✅ NEW - Environment variable template |
| `scripts/init-db.js` | ✅ NEW - Database initialization script |

## API Endpoints (No Changes!)
All endpoints remain the same - your frontend doesn't need any changes:
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET/POST/PUT/DELETE /api/devices`
- `GET/POST/PUT/DELETE /api/automation`
- `GET /api/events`
- `GET/PUT /api/thresholds/:context`
- `GET/POST/DELETE /api/scenes`
- ... and all others!

## Data Migration

If you had existing MongoDB data:
1. Export: `mongoexport --db xadapt --collection users --out users.json`
2. See `MONGODB_TO_MYSQL_MIGRATION.md` for migration scripts

## Troubleshooting

### MySQL Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:3306
```
✅ Solution: Ensure MySQL is running
```bash
# macOS
brew services start mysql

# Windows (Command Prompt as Admin)
net start MySQL80

# Docker
docker start mysql-xadapt
```

### Port 3306 Already in Use
```bash
# Find process using port 3306
lsof -i :3306

# Kill it
kill -9 <PID>
```

### Foreign Key Errors
- Ensure `userId` values exist in Users table
- Check `.env` database credentials

### Tables Not Created
Run initialization again:
```bash
npm run init-db
```

## Key Technical Changes

```javascript
// OLD (Mongoose)
const user = await User.findOne({ email });
await user.save();

// NEW (Sequelize)
const user = await User.findOne({ where: { email } });
await User.create({ email, password });
```

## Frontend Setup
No changes needed! Your React frontend continues to work with the same API:
```bash
cd frontend/xadapt-frontend
npm install
npm run dev
```

## Full Documentation
See `MONGODB_TO_MYSQL_MIGRATION.md` for detailed technical documentation.

## Support Files
- `.env.example` - Copy and modify for your setup
- `scripts/init-db.js` - Automated database initialization
- `config/database.js` - Sequelize configuration

## Next Steps
1. ✅ Install dependencies: `npm install`
2. ✅ Setup MySQL locally
3. ✅ Configure `.env` file
4. ✅ Run `npm run init-db`
5. ✅ Start server: `npm run test`
6. ✅ Test API endpoints

Happy coding! 🚀
