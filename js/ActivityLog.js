const fs = require('fs');
const path = require('path');

const logFilePath = path.join(__dirname, 'activity.log');

function logActivity(activity) {
  const timestamp = new Date().toISOString();
  const log = `[${timestamp}] ${activity}\n`;

  fs.appendFile(logFilePath, log, (err) => {
    if (err) {
      console.error('Error writing to log file:', err);
    }
  });
}

module.exports = { logActivity };
