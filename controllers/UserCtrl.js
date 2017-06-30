'use strict';

const userModel = require('../models/UserModel');
const config = require('../config/config');
const error_message = require('../errors.json');



/*******************
 *  Register
 ********************/
exports.register = async(req, res, next) => {
  if (req.body.pw1 != req.body.pw2) {
    return res.json(error_message[1204]);
  }

  let result = '';
  try {
    const user_data = {
      user_id: req.body.id,
      user_password: config.do_cipher(req.body.pw2),
      user_name: req.body.name,
      user_email: req.body.email,
      user_phone: req.body.phone
    };

    result = await userModel.register(user_data);

  } catch (error) {
    if (isNaN(error)) {
      console.log(error);
      return res.status(500).json(error);
    } else {
      console.log(error);
      return res.status(400).json(error);
    }
  }

  // success
  return res.status(200).json({
    "status": true,
    "message": "success",
    "result": result

  });
};


/*******************
 *  Login
 ********************/
exports.login = async(req, res, next) => {
  if (!req.body.id || !req.body.pw){
    return error_message[9401]
  }
  let result = '';

  try {
    const user_data = {
      user_id: req.body.id,
      user_password: config.do_cipher(req.body.pw)
    };
    result = await userModel.login(user_data);
  } catch (error) {
    if (isNaN(error)) {

      return res.status(500).json(error);
      // return next(error)
    } else {
      return res.status(400).json(error_message[error]);
    }
  }

  // success
  return res.json({
    "status": true,
    "message": "success",
    "result": result
  });
};

exports.edit = async(req, res, next) => {
  let result = '';

  try {
    const user_data = {



    };

    result = await userModel.edit(user_data);
  } catch (error) {
    if (isNaN(error)) {

      return res.status(500).json(error)
    } else {

      return res.status(400).json(error_message[error])
    }

  }

  // success
  return res.json(result);

};
