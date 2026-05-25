const express = require('express');
const os = require('os');
const app = express();
const PORT = process.env.PORT || 5000;

// Helper function to get LAN IP addresses
const getLanAddresses = () => {
  const interfaces = os.networkInterfaces();
  const addresses = [];
  for (const name in interfaces) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        addresses.push(iface.address);
      }
    }
  }
  return addresses;
};

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://localhost:${PORT}`);
  
  const lan = getLanAddresses();
  if (lan.length > 0) {
    console.log('\nOn your phone (Expo Go), API base URL should be:');
    lan.forEach((ip) => console.log(`http://${ip}:${PORT}/api`));
  }
});
