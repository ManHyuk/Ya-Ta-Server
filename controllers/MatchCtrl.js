'use strict';

const matchModel = require('../models/MatchModel');
const res_msg = require('../errors.json');

exports.owner = async(req, res, next) => {
  let result ='';
  try {
    const owner_data = {
      user_idx: req.user_idx
    };
    result = await matchModel.owner(owner_data)
  }catch (error){
    if (isNaN(error)) {
      console.log(error);
      return res.status(500).json(res_msg[9500]);
    } else {
      console.log(error);
      return res.status(400).json(res_msg[8400]);
    }

  }
  return res.status(200).json({result})
};

exports.list = async(req, res, next) => {
  let result = '';
  try {
    const match_data = {
      user_idx: req.user_idx,
      matching_idx: req.params.matching_idx,
    };

    result = await matchModel.list(match_data);
  } catch (error) {
    return next(error);
  }
  return res.status(200).json({result});
};


exports.register = async(req, res, next) => {

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

    result = await matchModel.register(owner_data, req.user_idx);


  } catch (error) {
    if (isNaN(error)) {
      console.log(error);
      return res.status(500).json(res_msg[9500]);
    } else {
      console.log(error);
      return res.status(400).json(res_msg[8400]);
    }
  }
  return res.status(200).json({
    "status":true,
    "message": "success",
    "result": result
  });


};
// 차주 / 매칭 승낙 누르면 타입 바꾸고 정보 보여주기
exports.approved = async(req, res, next) => {
  let result = '';
  try {
    const approved_data = {
      a_idx: req.params.applying_idx
    };

    result = await matchModel.approved(approved_data);
  }catch (error) {
    if (isNaN(error)) {
      console.log(error);
      return res.status(500).json(res_msg[9500]);
    } else {
      console.log(error);
      return res.status(400).json(res_msg[8400]);
    }

  }
  return res.status(200).json({
    "status": true,
    "message": "success",
    "result": result
  })
};


// 차주 / 매칭 완료  없어도 될듯
exports.completed = async(req, res, next) => {
  let result ='';
  try {
    const completed_data = {
      a_idx: req.params.applying_idx
    };

    result = await matchModel.completed(completed_data);

  }catch(error) {
    if (isNaN(error)) {
      console.log(error);
      return res.status(500).json(error);
    } else {
      console.log(error);
      return res.status(400).json(error);
    }
  }
  return res.status(200).json(res_msg[1200]);
};


// 차주 / 탑승 종료
exports.finished = async(req, res, next) => {
  let result = '';
  try {
    const finished_data = {
      m_idx: req.params.matching_idx
    };


    result = await matchModel.finished(finished_data);
  }catch (error) {
    if (isNaN(error)) {
      console.log(error);
      return res.status(500).json(error);
    } else {
      console.log(error);
      return res.status(400).json(error);
    }
  }

  return res.status(200).json({
    "status": true,
    "message": "success",
    "result": result

  })
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
    if (isNaN(error)) {
      console.log(error);
      return res.status(500).json(res_msg[9500]);
    } else {
      console.log(error);
      return res.status(400).json(res_msg[8400]);
    }
  }
  return res.status(200).json({result});
};

// 매칭 이력 조회
exports.inquiry = async(req,res,next)=>{
  let result ='';
  try {
    const inquiry_data ={
      user_idx: req.user_idx, //차주 입장일 때
    };

    result = await matchModel.inquiry(inquiry_data);
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
};

// 매칭 취소
exports.remove = async(req, res, next) => {
  let result= ``;

  try {
    const remove_data = {
      matching_idx: req.params.matching_idx
    };
    result = await matchModel.remove(remove_data)
  }catch (error){
    if (isNaN(error)) {
      console.log(error);
      return res.status(500).json(res_msg[9500]);
    } else {
      console.log(error);
      return res.status(400).json(res_msg[8400]);
    }
  }
  return res.status(200).json(res_msg[1200]);
};