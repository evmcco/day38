const express = require('express'),
    router = express.Router();
    restaurantsModel = require('../models/restaurants')
    // specificBusinessModel = require('../models/specificRestaurant')

/* GET home page. */
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

function numberToStars(num) {
    let rating = (num == 1) ? "*" 
    : (num == 2) ? "**"
    : (num == 3) ? "***"
    : (num == 4) ? "****"
    : (num == 5) ? "*****"
    : "NA";
    return rating
}

router.get('/:restaurant_id', async function(req, res, next) {
    // console.log("Business ID:", req.params.business_id);
    const restaurantInfo = await restaurantsModel.getOne(req.params.restaurant_id);
    const restaurantReviewsResponse = await restaurantsModel.getRestaurantReviews(req.params.restaurant_id);
    const restaurantReviews = restaurantReviewsResponse.rows;
    for (review in restaurantReviews) { 
        restaurantReviews[review].starSymbols = numberToStars(restaurantReviews[review].score);
    }
    console.log(restaurantReviews);
    res.render('template', {
        locals: {
            title: 'Belch',
            restaurantData: restaurantInfo,
            reviewsData: restaurantReviews,
            is_logged_in: req.session.is_logged_in,
            userID: req.session.user_id
        },
        partials: {
            partial: 'partial-specific-restaurant' //.html is implied
        }
    });
});

router.post('/:restaurant_id', (req,res) => {
    // restaurantId, userID, content, score
    const restaurantId = req.body.restaurantId;
    const userID = req.body.userID;
    const content = req.body.Review;
    const score = req.body.Rating;
    console.log(req.body)
    // console.log(`name: ${name}, rating: ${rating}, review:${review}`)
    restaurantsModel.addReview(restaurantId, userID, content, score)
    .then(async () => {
        // res.status(200).send('SUCCESS!');
        const restaurantInfo = await restaurantsModel.getOne(req.params.restaurant_id);
        const restaurantReviewsResponse = await restaurantsModel.getRestaurantReviews(req.params.restaurant_id);
        const restaurantReviews = restaurantReviewsResponse.rows;
        for (review in restaurantReviews) { 
            restaurantReviews[review].starSymbols = numberToStars(restaurantReviews[review].score);
        }
        console.log(restaurantReviews);
        res.render('template', {
            locals: {
                title: 'Belch',
                restaurantData: restaurantInfo,
                reviewsData: restaurantReviews,
                is_logged_in: req.session.is_logged_in,
                userID: req.session.user_id
            },
            partials: {
                partial: 'partial-specific-restaurant' //.html is implied
            }
        });
    })
    .catch((err) => {
        res.sendStatus(500).send(err.message);
    });
});

module.exports = router;