'use strict';



const authCtrl = require('../controllers/AuthCtrl');
const userCtrl = require('../controllers/UserCtrl');



module.exports = (router) => {

  // USER REGISTER
  router.route('/user/register')
    .post(userCtrl.register);

  // USER LOGIN
  router.route('/user/login')
    .post(userCtrl.login);




  return router;
};
