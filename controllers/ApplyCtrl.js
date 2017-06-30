'use strict';

const applyModel = require('../models/ApplyModel');
const res_msg = require('../errors.json');


// 운전자 -> 차주 매칭 검색 (조회)
exports.search = async(req, res, next) => {

  let result = '';
  try {
    const search_data = {
      sloc: req.params.sloc,
      eloc: req.params.eloc,

    };

    result = await applyModel.search(search_data);

  }catch (error) {
    if (isNaN(error)) {
      console.log(error);
      return res.status(500).json(error);
    } else {
      console.log(error);
      return res.status(400).json(error);
    }
  }

  return res.json(result)

};

// 운전자 -> 차주 메챙 신청
// ('/driver/:matching_idx/apply')
exports.apply = async(req, res, next) => {
  let result = '';

  try {
    const apply_data = {
      user_idx: req.user_idx,
      matching_idx: req.params.matching_idx,
      apply_message: req.body.message
    };

    result = await applyModel.apply(apply_data);
  }catch (error) {
    if (isNaN(error)) {
      console.log(error);
      return res.status(500).json(error);
    } else {
      console.log(error);
      return res.status(400).json(error);
    }
  }
  return res.json(res[1200])


};