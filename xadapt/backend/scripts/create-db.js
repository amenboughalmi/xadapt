#!/usr/bin/env node
/**
 * Create Database Script
 * Creates the MySQL database before running initialization
 */

require('dotenv').config();
const mysql = require('mysql2/promise');

async function createDatabase() {
  try {
    console.log('🔄 Creating database...\n');

    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3308,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
    });

    console.log('📡 Connected to MySQL server');

    const dbName = process.env.DB_NAME || 'mybd';
    console.log(`📊 Creating database: ${dbName}`);

    await connection.execute(`CREATE DATABASE IF NOT EXISTS ${dbName}`);
    console.log(`✅ Database '${dbName}' created successfully!\n`);

    await connection.end();

    console.log('🚀 Now running init-db.js...\n');
    
    // Run the init-db script
    require('./init-db');

  } catch (error) {
    console.error('❌ Failed to create database:\n');
    console.error('Error:', error.message);
    console.error('\n⚠️  Make sure:');
    console.error('   1. MySQL server is running');
    console.error('   2. .env file is configured correctly');
    console.error('   3. Root credentials are valid\n');
    process.exit(1);
  }
}

createDatabase();
