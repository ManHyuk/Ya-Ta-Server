'use strict';

const applyModel = require('../models/ApplyModel');
const res_msg = require('../errors.json');

exports.list = async(req, res, next) => {
  let result = '';
  try {

    const list_data = {
      u_idx : req.user_idx
    };

    console.log(list_data);
    result = await applyModel.list(list_data);
  }catch(error){
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
// 없어도 될듯
// exports.approved = async(req, res,next)=>{
//   let result = '';
//   try {
//     const approved_data = {
//       m_idx: req.params.matching_idx
//     };
//
//     result = await applyModel.approved(approved_data);
//   }catch (error) {
//     if (isNaN(error)) {
//       console.log(error);
//       return res.status(500).json(res_msg[9500]);
//     } else {
//       console.log(error);
//       return res.status(400).json(res_msg[8400]);
//     }
//   }
//   return res.status(200).json(res_msg[1200])
// };

exports.completed = async(req, res, next) => {
  let result = '';
  try {
    const completed_data = {
      a_idx: req.params.applying_idx
    };

    console.log(req.params.applying_idx);
    result = await applyModel.completed(completed_data);
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
      a_idx: req.params.applying_idx
    };
    console.log(finished_data.a_idx);
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

// 매칭 이력 조회
exports.inquiry = async(req,res,next)=>{
  let result ='';
  try {
    const inquiry_data ={
      user_idx: req.user_idx, //운전자 입장일 때
    };
    result = await applyModel.inquiry(inquiry_data);
    console.log(req.user_idx);
  }catch(error){

    if(isNAN(error)){

      return res.status(500).json(res_msg[9500]);

    } else{

      console.log(error);
      return res.status(400).json(res_msg[8400]);

    }
  }
  return res.status(200).json({result});

}
