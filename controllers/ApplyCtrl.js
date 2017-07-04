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

  return res.status(200).json({result});

};

// 운전자 / 차주 메칭 신청 -> 매칭 타입 업데이트
// ('/driver/apply/:matching_idx')
// FIXME 운전자가 같은 차주에게 두번 신청할 경우 막기
exports.apply = async(req, res, next) => {
  let result = '';

  try {
    const apply_data = {
      user_idx: req.user_idx,
      matching_idx: req.params.matching_idx,
      apply_message: req.body.message,
      apply_companion: req.body.companion
    };

    result = await applyModel.apply(apply_data);
  }catch (error) {
    if (isNaN(error)) {
      console.log(error);
      return res.status(500).json(res_msg[9500]);
    } else {
      console.log(error);
      return res.status(400).json(res_msg[8400]);
    }
  }
  return res.json(res_msg[1200])

};

// 운전자 / 차주 매칭 승낙 -> 매칭 타입 업데이트
exports.approved = async(req, res,next)=>{
  let result = '';
  try {
    const approved_data = {
      m_idx: req.params.matching_idx
    };

    result = await applyModel.approved(complete_data);
  }catch (error) {
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

exports.matching = async(req, res, next) => {
  let result = '';
  try {
    const match_data = {
      a_idx: req.params.applying_idx
    };

    result = await applyModel.matching(match_data);
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


exports.finished = async(req, res, next) => {
  let result ='';
  try {
    const finished_data = {
      m_idx: req.params.matching_idx
    };
    result = await applyModel.finished(finished_data);
  }catch (error) {
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
    if (isNaN(error)) {
      console.log(error);
      return res.status(500).json(res_msg[9500]);
    } else {
      console.log(error);
      return res.status(400).json(res_msg[8400]);
    }
  }
  return res.status(200).json({result});
}
