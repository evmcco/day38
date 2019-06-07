var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('template', {
    locals: {
      title: 'Express - Day38',
      userName: req.session.first_name,
      is_logged_in: req.session.is_logged_in,
      userID: req.session.user_id
    },
    partials: {
      partial: 'partial-index'
    }
  });
});

router.get('/home', async function(req, res, next) {
  const allRestaurants = await restaurantsModel.getAll();
  console.log("allRestaurants", allRestaurants);
  res.render('template', {
      locals: {
          title: 'Relp',
          restaurantsList: allRestaurants,
          is_logged_in: req.session.is_logged_in,
          userID: req.session.user_id
      },
      partials: {
          partial: 'partial-restaurants' //.html is implied
      }
  });
});

module.exports = router;
