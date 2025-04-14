var express = require('express');
var router = express.Router();

const Trip = require('../models/trips');
const Booking = require('../models/bookings');
const { checkBody } = require('../modules/checkBody');

router.post('/', (req, res) => { // Add a new booking
  if (!checkBody(req.body, ['tripId'])) {
    res.json({ result: false, error: 'Missing trip ID' });
    return;
  }

  Trip.findById(req.body.tripId).then(trip => { // Find the trip by ID
    if (trip) {
      const newBooking = new Booking({// Create a new booking
        trip: trip._id,
        isPaid: false,
      });

      newBooking.save().then(() => {// Save the booking to the database
        res.json({ result: true });
      });
    } else {
      res.json({ result: false, error: 'Trip not found' });
    }
  });
});




router.get('/', (req, res) => { // Get all unpaid bookings
  Booking.find({ isPaid: false }) // Find all bookings that are not paid 
    .populate('trip')// Populate the trip field with trip data
    .then(bookings => {
      if (bookings.length > 0) { // Check if there are any bookings
        res.json({ result: true, bookings });// Return the bookings if found
      } else {
        res.json({ result: false, error: 'No bookings found' });
      }
    });
});

router.delete('/:tripId', (req, res) => { // Delete a booking by trip ID
  Booking.deleteOne({ trip: req.params.tripId }).then(({ deletedCount }) => {// Delete the booking
    Booking.find({ isPaid: false })
      .populate('trip')
      .then(bookings => {
        res.json({ result: deletedCount > 0, bookings });
      });
  });
});

module.exports = router;
