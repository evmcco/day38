const express = require('express'),
  bcrypt = require('bcryptjs'),
  router = express.Router();
  User = require('../models/user')

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('template', {
    locals: {
      title: 'Express - Day38',
      is_logged_in: req.session.is_logged_in,
      userID: req.session.user_id
    },
    partials: {
      partial: 'partial-index'
    }
  });
});

router.get('/login', (req, res) => {
  res.render('template', {
    locals: {
      title: 'Login Page',
      is_logged_in: req.session.is_logged_in,
      userID: req.session.user_id
    },
    partials: {
      partial: 'partial-login-form'
    }
  })
})

router.get('/signup', (req, res) => {
  res.render('template', {
    locals: {
      title: 'Sign Up Page',
      is_logged_in: req.session.is_logged_in,
      userID: req.session.user_id
    },
    partials: {
      partial: 'partial-signup-form'
    }
  })
})

router.get('/logout', (req,res) => {
  req.session.destroy();
  res.redirect('/home');
})

router.post('/login', (req, res) =>{
  const { email, password } = req.body;

  const userInstance = new User(null, null, null, email, password);
  console.log("userInstance:", userInstance)
  userInstance.login().then(response => {
    req.session.is_logged_in = response.isValid;
    if (!!response.isValid) {
      req.session.first_name = response.first_name;
      req.session.last_name = response.last_name;
      req.session.user_id = response.user_id;
      res.redirect('/home');
    } else {
      res.sendStatus(401);
    }
  })
})

router.post('/signup', (req, res) => {
  const {first_name, last_name, email, password} = req.body;

  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);

  const userInstance = new User(null, first_name, last_name, email, hash);

  userInstance.save().then(response => {
    console.log(response);
    res.sendStatus(200);
  });
})

module.exports = router;