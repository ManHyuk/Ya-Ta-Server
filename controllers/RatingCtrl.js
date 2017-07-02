'use strict';

const ratingModel = require('../models/RatingModel');
const res_msg = require('../errors.json');

exports.write = async(req, res , next) => {

  let result = '';

  try {

    const rating_data = {
      sender_idx: req.user_idx,
      receiver_idx: req.params.receiver_idx,
      rating_star: req.body.star
    };
    result = await ratingModel.write(rating_data)
  }catch (error){
    if (isNaN(error)) {
      console.log(error);
      return res.status(500).json(res_msg[9500]);
    } else {
      console.log(error);
      return res.status(400).json(res_msg[8400]);
    }
  }

  return res.status(200).json(res_msg[1200])
};
