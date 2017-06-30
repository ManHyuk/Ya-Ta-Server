'use strict';

const userModel = require('../models/AuthModel');
const res_msg = require('../errors.json');
/*******************
 *  Authenticate
 ********************/
exports.auth = (req, res, next) => {
  if (!req.headers.token) {
    return res.status(400).json(res_msg[401]);
  } else {
    userModel.auth(req.headers.token, (err, user_idx) => {
      if (err) {
        return res.json(res_msg[err]);
      } else {
        req.user_idx = user_idx;
        return next();
      }
    });
  }
};