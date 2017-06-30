'use strict';


const authCtrl = require('../controllers/AuthCtrl');
const userCtrl = require('../controllers/UserCtrl');
const matchCtrl = require('../controllers/MatchCtrl');
const applyCtrl = require ('../controllers/ApplyCtrl');
const ratingCtrl = require('../controllers/RatingCtrl');
const profileCtrl = require('../controllers/ProfileCtrl');

module.exports = (router) => {

  // USER REGISTER
  router.route('/user/register')
    .post(userCtrl.register);

  // USER LOGIN
  router.route('/user/login')
    .post(userCtrl.login);

  // PROFILE EDIT
  router.route('/profile/:user_idx')
    .put(authCtrl.auth, profileCtrl.uploadImage, profileCtrl.updating);

  // OWNER
  router.route('/owner/match/register')
    .post(authCtrl.auth, matchCtrl.register);
  router.route('/owner/rating/:receiver_idx')
    .post(authCtrl.auth, ratingCtrl.write);


  // DRIVER
  router.route('/driver/:matching_idx/apply')
    .post(authCtrl.auth, applyCtrl.apply);
  router.route('/driver/search/:sloc/:eloc')
    .get(authCtrl.auth, applyCtrl.search);
  router.route('/dirver/rating/:receiver_idx')
    .post(authCtrl.auth, ratingCtrl.write);

  return router;
};
