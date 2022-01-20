import express from 'express';
import fs from 'fs';

const router = express.Router();

router.get('/:collection', async (req, res, next) => {
  const data = await fs.promises.readFile(
    `${process.cwd()}/server/data/${req.params.collection}.json`
  );
  // Simulate slow server response
  setTimeout(() => res.json(JSON.parse(data)), 1500);
});

export { router };
