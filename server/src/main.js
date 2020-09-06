const path = require('path');
const https = require('https');
const http = require('http');
const fs = require('fs');
const crypto = require('crypto');

const express = require('express');
const ejs = require('ejs');
const morgan = require('morgan');
const QRcode = require('qrcode');

const firebaseAdmin = require('firebase-admin');
if (fs.existsSync("service-account.json")) {
  let serviceAccount = JSON.parse(fs.readFileSync("service-account.json", 'utf-8'));
  firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert(serviceAccount)
  });
}

const app = express();
const config = {};

if (fs.existsSync("config.json")) {
  const cfg = JSON.parse(fs.readFileSync("config.json", 'utf-8'));
  Object.assign(config, cfg);
}
if (process.env.USE_HTTPS) {
    config.useHttps = process.env.USE_HTTPS != "0";
}
app.set('config', config);

app.set('view engine', 'html');
app.engine('html', ejs.renderFile);

app.use(morgan('combined'));
app.use(express.static(path.join(__dirname, '../../public')));
app.use(express.json());

function generateItemId(username, item) {
  const json = JSON.stringify(item);
  const hash = crypto.createHash('sha256');
  hash.update(json);
  return `u:${username}:${hash.digest('hex')}`;
}

app.post('/api/item/', function (req, res) {
  const username = 'hylom';
  const item = req.body;
  const data = {
    timestamp: Date.now(),
  };
  Object.assign(data, item);
  const itemId = generateItemId(username, data);

  const db = firebaseAdmin.firestore();
  const docRef = db.collection('items').doc(itemId);
  const rs = docRef.set(data);
  res.json({ itemId: itemId,
             data: data
           });
});

app.get('/api/item/', function (req, res) {
  const username = 'hylom';
  const db = firebaseAdmin.firestore();
  db.collection('items').get()
    .then(snapshot => {
      const result = [];
      snapshot.forEach(doc => {
        result.push(doc.data());
      });
      res.json(result);
    });
});

app.get('/', function (req, res) {
    res.render('index', { config: config });
});

/*
app.get('/qr.png', function (req, res) {
    const url = app.get('config').url;
    res.type('image/png');
    QRcode.toFileStream(res, url);
});
*/

const port = process.env.PORT || 3000;
const options = {};
const transport = config.useHttps ? https : http;
let proto = 'http';

if (config.useHttps) {
    const key_path = process.env.HTTPS_KEY || "./.certs/privkey.pem";
    const cert_path = process.env.HTTPS_CERT || "./.certs/fullchain.pem";

    options.key = fs.readFileSync(key_path);
    options.cert = fs.readFileSync(cert_path);
    proto = 'https';
}

transport.createServer(options, app).listen(port);
console.log(`listening by ${proto} at :${port}...`);
