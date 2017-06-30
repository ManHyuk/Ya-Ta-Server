'use strict';

const profileModel = require('../models/ProfileModel');
const res_msg = require('../errors.json');

const fs = require('fs');

const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');


exports.updating = async(req, res, next) => {
  let result ='';

  try {
    const profile_data = [];

    console.log(req.files);
    for (let i=0, len=req.files.length; i<len; i++) {
      profile_data[i] = [];
      profile_data[i].push(req.files[i].location, parseInt(req.params.user_idx, 10));
    }
    console.log(profile_data);
    result = await profileModel.updating(profile_data);
  }catch (error){
    return next(error);
  }
  // return res.json(req.files);
  return res.json(result);
};


aws.config.loadFromPath('./config/aws_config.json');

const s3 = new aws.S3();

const storageS3 = multerS3({
  s3: s3,
  bucket: 'zzicme',
  acl: 'public-read',
  key: function (req, file, callback) {
    const fname = Date.now() + '_' + file.originalname;
    callback(null, fname);
  }
});

exports.uploadImage = multer({storage: storageS3}).array('image', 5);


// const storage = multer.diskStorage({
//   destination: (req, file, callback) => {
//     // 이미지 파일 검사
//     if (file.mimetype !== 'image/jpg' && file.mimetype !== 'image/jpeg' && file.mimetype !== 'image/png') {
//       callback(9402);
//     } else {
//       callback(null, 'public/images/');
//     }
//   },
//   filename: (req, file, callback) => {
//     const fname = Date.now() + '_' + file.originalname;
//     callback(null, fname);
//   }
// });

