require('dotenv').config();
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('🔧 Setting up BookClub application...');

// runs sql scripts with root mysql user
// prompts for password for security
function runSqlScript(scriptPath, callback) {
    const command = `mysql -u root -p < "${scriptPath}"`;

    console.log(`Running SQL script: ${path.basename(scriptPath)}`);
    console.log('You will be prompted for your MySQL root password.');

    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error: ${error.message}`);
            return callback(error);
        }
        if (stderr) {
            console.error(`Script output: ${stderr}`);
        }
        console.log('SQL script executed successfully.');
        callback(null);
    });
}

// database set up process
// runs setup.sql to create database, tables and sample data.
function setup() {
    const setupScriptPath = path.join(__dirname, 'setup.sql');

    runSqlScript(setupScriptPath, (error) => {
        if (error) {
            console.error('❌ Database setup failed. Please check error messages above.');
            return;
        }

        console.log('✅ Database setup completed successfully!');
        console.log('\nYou can now start the application:');
        console.log('1. Start the backend: npm run dev');
        console.log('2. Start the frontend: cd ../web && npm start');
        console.log('\nDefault login:');
        console.log('Email: default@example.com');
        console.log('Password: password123');
    });
}

// runs set up process automatically when script runs.
setup();