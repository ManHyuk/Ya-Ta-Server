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

// 운전자 -> 차주 메칭 신청
// ('/driver/apply/:matching_idx')
// FIXME 운전자가 같은 차주에게 두번 신청할 경우 막기
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
  return res.json(res_msg[1200])

};


// 운전자 => 차주 상세보기
// FIXME 별점 수정

exports.detail = async(req, res, next) =>{
  let result = '';
  try {
    const detail_data = {
      matching_idx: req.params.matching_idx,
    };

    result = await applyModel.detail(detail_data);
  }catch(error){
    return next(error);
  }
  return res.json(result);
}
