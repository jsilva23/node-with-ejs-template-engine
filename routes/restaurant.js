const express = require('express');
const uuid = require('uuid');

const resData = require('../util/restaurant-data');

const router = express.Router();

router.get('/restaurants', (req, res) => {
  let order = req.query.order;
  let nextOrder = 'desc';

  if (order !== 'asc' && order !== 'desc') {
    order = 'asc';
  }

  if (order === 'desc') {
    nextOrder = 'asc';
  }

  const restaurants = resData.getStoredRestaurants();

  restaurants.sort((resA, resB) => {
    if (
      (order === 'asc' && resA.name > resB.name) ||
      (order === 'desc' && resB.name > resA.name)
    ) {
      return 1;
    }
    return -1;
  });

  const numberOfRestaurants = restaurants.length;

  res.render('restaurants', {
    numberOfRestaurants,
    restaurants,
    nextOrder,
  });
});

router.get('/restaurants/:id', (req, res) => {
  const restaurantId = req.params.id;

  const restaurants = resData.getStoredRestaurants();

  for (const restaurant of restaurants) {
    if (restaurant.id === restaurantId) {
      return res.render('restaurant-detail', { restaurant });
    }
  }

  res.status(404).render('404');
});

router.get('/recommend', (req, res) => {
  res.render('recommend');
});

router.post('/recommend', (req, res) => {
  const restaurant = req.body;
  restaurant.id = uuid.v4();

  const restaurants = resData.getStoredRestaurants();

  restaurants.push(restaurant);

  resData.storeRestaurants(restaurants);

  res.redirect('/confirm');
});

router.get('/confirm', (req, res) => {
  res.render('confirm');
});

module.exports = router;
