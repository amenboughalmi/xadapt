# 🚨 MySQL Setup Required for Windows

Your MySQL server is not running. Here's how to fix it:

## Option 1: Using MySQL Installer (Recommended for Windows)

### Step 1: Download MySQL
1. Go to https://dev.mysql.com/downloads/mysql/
2. Download "MySQL Server" (latest version)
3. Choose Windows installer

### Step 2: Install MySQL
1. Run the installer
2. Select "Server only" or "Full" installation
3. In "MySQL Server Configuration":
   - Port: **3306** (default)
   - Config Type: **Server Machine**
4. MySQL Configuration:
   - User: **root**
   - Password: **root** (or any password you prefer)
5. Complete installation

### Step 3: Start MySQL Service
- Windows will auto-start MySQL after installation
- To verify it's running:
  - Open Services (services.msc)
  - Look for "MySQL80" or "MySQL Installer"
  - Status should be "Running"

---

## Option 2: Using Windows Terminal/PowerShell

After MySQL installation, start the service:

```powershell
# As Administrator
net start MySQL80
```

To stop:
```powershell
net stop MySQL80
```

---

## Option 3: Using Docker (If Installed)

```bash
docker run --name mysql-xadapt -e MYSQL_ROOT_PASSWORD=root -p 3306:3306 -d mysql:latest
```

---

## Step 4: Verify MySQL is Running

Test connection:
```bash
cd backend
npm run init-db
```

---

## If Using Different Password

If you set a different MySQL password during installation, update `.env`:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_actual_password  ← Change this
DB_NAME=xadapt
```

Then run:
```bash
npm run init-db
```

---

## Troubleshooting

**MySQL won't start?**
- Check Services (services.msc)
- Reinstall MySQL if needed

**Port 3306 already in use?**
- Change `DB_PORT=3307` in .env
- Or kill process using port 3306

**Still getting connection error?**
- Verify MySQL service is running
- Check .env credentials
- Try connecting directly: `mysql -u root -p`

---

**After MySQL is running, execute:**
```bash
cd c:\Users\ASUS X515 I5\Desktop\xadapt\backend
npm run init-db
```
