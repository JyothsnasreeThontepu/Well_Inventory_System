const express = require('express');
const session = require('express-session');
const mysql = require('mysql2');
const oracledb = require('oracledb');
const path = require('path');

const app = express();
const PORT = 3000;

// Disable browser cache
app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store');
  next();
});

// Session setup
app.use(session({
  secret: 'Xy9$Lp@8Zw!rTb#1Df%Jq03K^Vc&Ns*U',
  resave: false,
  saveUninitialized: false
}));

// Oracle DB config
const oracleConfig = {
  user: 'system',
  password: '123456',
  connectString: 'localhost/XEPDB1'
};

// MySQL config
const mysqlConnection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '123456',
  database: 'login_page'
});

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Static files (no index.html auto-serve)
app.use(express.static(path.join(__dirname, 'public'), { index: false }));

// Login page route
app.get('/', (req, res) => {
  if (req.session.loggedIn) {
    return res.redirect('/index');
  }
  res.sendFile(path.join(__dirname, 'view', 'login.html'));
});

// Login handler
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  const query = 'SELECT * FROM users1 WHERE email = ? AND password = ?';
  mysqlConnection.query(query, [email, password], (err, results) => {
    if (err) return res.status(500).send('Internal Server Error');

    if (results.length > 0) {
      req.session.loggedIn = true;
      req.session.email = email;
      res.redirect('/index');
    } else {
      res.send(`
        <script>
          alert("Invalid email or password!");
          window.location.href = "/";
        </script>
      `);
    }
  });
});

// Protected index route (manual serve)
app.get('/index', (req, res) => {
  if (req.session.loggedIn) {
    res.sendFile(path.join(__dirname, 'view', 'index.html'));
  } else {
    res.redirect('/');
  }
});

// Logout route
app.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
});

// Oracle API for well data
app.get('/api/wells', async (req, res) => {
  let connection;
  try {
    connection = await oracledb.getConnection(oracleConfig);
    const result = await connection.execute(
      `SELECT * FROM wells`,
      [],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Oracle DB error:', err);
    res.status(500).json({ error: 'Database query error' });
  } finally {
    if (connection) await connection.close();
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
