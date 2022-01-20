import fs from 'fs';
import https from'https';
import express from 'express';
import webpush from 'web-push';
import bodyParser from 'body-parser';

import { router } from './router.js';
import { subscriptor } from './subscriptor.js';

const publicVapidKey = 'BHmJEx6MMR9E85Rmks_x3Bc5yeOXg3kOGpcc1Cc-t3GFNpsm0A10PIK2ebxIAYfDou07Wv4qWcD63-rDwPR5vcE';
const privateVapidKey = 'Jp2gJDTObmds-Peah52Ekent8noWkSMEriU3-n2d138';

const app = express();
const port = 8443;

app.use(bodyParser.json());
webpush.setVapidDetails('localhost', publicVapidKey, privateVapidKey);

app.get('/js/service-worker.js', (req, res, next) => {
  res.set('Service-Worker-Allowed', '/');
  next();
});

app.get('/images/:image.jpg', (req, res, next) => {
  // Simulate slow server response
  setTimeout(
    () => res.sendFile(`${process.cwd()}/dist/images/${req.params.image}.jpg`),
    1500
  );
});

app.use(express.static(`${process.cwd()}/dist`));

app.get('/', (req, res) => {
  res.sendFile(`${process.cwd()}/server/index.html`);
});

app.post('/register', function(req, res) {
  console.log('Registering push notifications');
  const subscription = req.body.subscription;
  res.sendStatus(201);
});

app.post('/subscribe', function (req, res) {
    console.log(req.body);
    const payload = req.body.payload;
    const options = {
      TTL: 0
    };
    const subscription = req.body.subscription;
    setTimeout(function() {
      webpush.sendNotification(subscription, payload, options)
      .then(function() {
        res.sendStatus(201);
      })
      .catch(function(error) {
        console.log(error);
        res.sendStatus(500);
      });
    }, 3000);
});

app.use('/api', router);
app.use('/subscribe', subscriptor);

app.listen(3000, () => {
  console.log(`PWA workshp app listening at http://0.0.0.0:3000`);
});

https.createServer({
  key: fs.readFileSync('red-dead-pwa.key'),
  cert: fs.readFileSync('red-dead-pwa.crt')
}, app).listen(port, function(){
  console.log("My HTTPS server listening on port " + port + "...");
});
