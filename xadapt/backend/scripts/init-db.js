#!/usr/bin/env node
/**
 * Database Initialization Script
 * Creates database and tables for xadapt
 */

require('dotenv').config();

async function initializeDatabase() {
  try {
    console.log('🔄 Initializing xAdapt database...\n');

    // Import Sequelize models
    const sequelize = require('../config/database');

    // Test connection
    console.log('📡 Testing database connection...');
    await sequelize.authenticate();
    console.log('✅ Database connection successful\n');

    // Sync models
    console.log('📊 Creating/updating tables...');
    await sequelize.sync({ alter: true });
    console.log('✅ All tables synced successfully\n');

    console.log('═══════════════════════════════════════════');
    console.log('✅ Database initialization complete!');
    console.log('═══════════════════════════════════════════\n');

    console.log('📋 Tables created:');
    console.log('  • users');
    console.log('  • devices');
    console.log('  • automation_rules');
    console.log('  • context_events');
    console.log('  • context_thresholds');
    console.log('  • simulation_scenes\n');

    console.log('🚀 Ready to start server with: npm run test\n');

    await sequelize.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Database initialization failed:\n');
    console.error('Error Message:', error.message);
    console.error('Error Code:', error.code);
    if (error.errno) console.error('Error Number:', error.errno);
    console.error('\n⚠️  Make sure:');
    console.error('   1. MySQL server is running');
    console.error('   2. .env file is configured correctly');
    console.error('   3. Database credentials are valid\n');
    console.error('Full error:', error);
    process.exit(1);
  }
}

initializeDatabase();
