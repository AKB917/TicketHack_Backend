
const express = require('express');
const router = express.Router();

require('../models/connection');
const moment = require('moment');
const Trip = require('../models/trips'); // 👈 important

router.get('/search/:departure/:arrival/:date', (req, res) => {
  const { departure, arrival, date } = req.params;

  // Convertir la date pour filtrage (on cherche juste sur le jour)
  const dayStart = moment(date).startOf('day').toDate();
  const dayEnd = moment(date).endOf('day').toDate();

  Trip.find({
    departure,
    arrival,
    date: { $gte: dayStart, $lte: dayEnd }
  }).then(trips => {
    if (trips.length > 0) {
      res.json({ result: true, trips });
    } else {
      res.json({ result: false, error: 'No trip found' });
    }
  }).catch(err => {
    console.error('Erreur Trip.find:', err);
    res.status(500).json({ result: false, error: 'Database error' });
  });
});

module.exports = router;

