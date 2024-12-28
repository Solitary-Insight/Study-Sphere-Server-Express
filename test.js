const mysql = require('mysql2');
const fs = require('fs');

// Load the SSL certificate
const caCertificate = `-----BEGIN CERTIFICATE-----
MIIEQTCCAqmgAwIBAgIUXVVGTai0jwExh8iItQ6z7pQ7VOswDQYJKoZIhvcNAQEM
BQAwOjE4MDYGA1UEAwwvNDU2MGJiN2QtOGFiOC00NGQ4LWE0NTMtNDk2ODBhOTlj
OThjIFByb2plY3QgQ0EwHhcNMjQwMjIwMTU1NjUyWhcNMzQwMjE3MTU1NjUyWjA6
MTgwNgYDVQQDDC80NTYwYmI3ZC04YWI4LTQ0ZDgtYTQ1My00OTY4MGE5OWM5OGMg
UHJvamVjdCBDQTCCAaIwDQYJKoZIhvcNAQEBBQADggGPADCCAYoCggGBAKfBKyeS
gy8TN5yg+xK2A3OFFfYtWjoZODJ/beB9P1SaxHf+pQpfuh5Gg6ODt4AkZfxVZNaN
aTSPsr0AH5uNpV68FKCkNeMSXEzTI72fipnSgGC6adGbANzKB0Xoo8x3cuky6Jym
ZRTZHeUNnRwyJjQ3pF4PP6+9q9n3vZziYMFB0mtKNqFhOxfT5QHir3p78ay1TC+/
pvp9fVPaJ8z42jjQt7/vAkmiyeT+z86MbAhcR7ka+tKsZUoix9OqWqR1h+gj3Jz0
jtTlTF7aDrEnWhExlkqPBP6+3ei0/GuJkum0kDRb7EWjsLYboxwVL7KhxyQlaB5Q
HqQ/X/suBAWKqubce0sE/fGYg0oEmdPm63gdhJwynUU2RUzTq4vWpC38PDLK9oiN
nBT7Q8SULAw4NxPoHiBKePtJXiBHpeR/wNzFddm5poGGCDRMU17VnXMWKsn70Ipz
Y/rh1l+e+sxB6uFMR+G3LZK/47jMdegppG4FxZRJZCJObPatb8DBBx3O0QIDAQAB
oz8wPTAdBgNVHQ4EFgQUMvSJlqEM9v+PEKQOmdCJj/uN0IUwDwYDVR0TBAgwBgEB
/wIBADALBgNVHQ8EBAMCAQYwDQYJKoZIhvcNAQEMBQADggGBAHwKOZcI3il2cwpU
7b7YHznmjO9bNt3fDEGmQj7xBivGSIlgsGXz4uZf28KU0QtlQAFI//MGan/XVKNV
lmHBrQzpn6K6PSNPF3iBNPUKNGOMTMfP/r4j9UJoG0xd6WZq6aNKI/+XsKN+nIjV
b9dNAhEhyPmHBi5TeAhvzIk6UPb08kP9A2L73RUbk54Sd72gzfONYMQOXZ6P3uU1
2yY0yMurdTfjCYEJTVRWEJjDVYmuv4TPxnPLAR/nEwSY/xByYzM5do7EadaeqcYK
bXRL/tHEdIZTzva95PrIVNt9/NbFd8TnWvoBfDSotyh+DGBbPsHZm314S4YH9Um3
RWRc+WeFfU+kKae9EWromCab+cSMTUTmQAtLup6gxLw4rnx9Otz/r9ZGcekoBuyc
k/2ReUfdxJafQURt7+VguRUIXgDTDB3OnrHboDTzu/rFLFSCNtkWhU+Ci38165JY
IYMstq5F5rI/6BuQ1U8fAtqOpLVqdsfMJd7Ku9GXnUjzFfFW6w==
-----END CERTIFICATE-----`;

const connection = mysql.createConnection({
  host: '************************',
  user: '****',
  password: '***********',
  database: '*********',
  port: ********,
  ssl: {
    ca: caCertificate  // Add the CA certificate for SSL
  }
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err.message);
    return;
  }
  console.log('Connected to MySQL database!');
  
  // Sample query to test connection
  connection.query('SHOW TABLES;', (err, results) => {
    if (err) throw err;
    console.log('Tables in database:', results);
  });

  connection.end();
});

