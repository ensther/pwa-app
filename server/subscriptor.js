import express from 'express';
import fs from 'fs';

const subscriptor = express.Router();

subscriptor.post('/subscribe', (req, res) => {
  console.log("Subscribe post method");
  const subscription = req.body;
  //Save the subscript on server side database

  webpush.sendNotification(subscription, JSON.stringify({
    title: 'PWA push notifications are active',
  }));
  res.sendStatus(200);
});

export { subscriptor };
