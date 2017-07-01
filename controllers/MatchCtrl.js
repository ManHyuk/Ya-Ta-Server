'use strict';

const matchModel = require('../models/MatchModel');
const error_message = require('../errors.json');

exports.list = async(req, res, next) => {
  let result = '';
  try {
    const match_data = {
      matching_idx: req.params.matching_idx,
    };

    result = await matchModel.list(match_data);
  } catch (error) {
    return next(error);
  }
  return res.json(result);
};


exports.register = async(req, res, next) => {
  if (!req.body.slat || !req.body.slng || !req.body.sloc ||!req.body.elat || !req.body.elng || !req.body.eloc ||
   !req.body.companion || !req.body.time || !req.body.message) {
    return res.json(error_message[9401])
  }


  let result = '';
  try {
    // FIXME : 바디 숫자 줄이기
    const owner_data = {
      owner_idx: req.user_idx,
      owner_slng: req.body.slng,
      owner_slat: req.body.slat,
      owner_sloc: req.body.sloc,
      owner_saddr: req.body.saddr,
      owner_elng: req.body.elng,
      owner_elat: req.body.elat,
      owner_eloc: req.body.eloc,
      owner_eaddr: req.body.eaddr,
      owner_companion: req.body.companion,
      owner_time: req.body.time,
      owner_message: req.body.message,
    };

    result = await matchModel.register(owner_data);

  } catch (error) {
    if (isNaN(error)) {
      console.log(error);
      return res.status(500).json(error);
    } else {
      console.log(error);
      return res.status(400).json(error);
    }
  }
  return res.json({
    "status": true,
    "message": "success"
  })


};

exports.completed = async(req, res, next) => {

};





// 차주 => 운전자 정보 상세보기
exports.detail = async(req, res, next) =>{
  let result = '';
  try {
    const detail_data={
      applying_idx: req.params.applying_idx,
    };

    result = await matchModel.detail(detail_data);
  }catch(error){
    return next(error);
  }
  return res.json(result);
}

