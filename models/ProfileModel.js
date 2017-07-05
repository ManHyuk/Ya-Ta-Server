
'use strict';

const mysql = require('mysql');
const DBConfig = require('./../config/DBConfig');
const pool = mysql.createPool(DBConfig);

exports.inform = (profile_data) => {
  return new Promise((resolve, reject)=> {
    const sql =
      "SELECT user_id, user_name, user_email, user_phone, user_insure, user_img, user_type " +
      "FROM user WHERE user_idx = ? ";

    pool.query(sql, [profile_data.user_idx], (err, rows) => {
      if (err){
        reject(err);
      }else{
        resolve(rows[0]);
      }
  })
  })

};


exports.updating = (profile_data) => {
  return new Promise((resolve, reject) => {
    const sql =
      "UPDATE user SET user_img = ? WHERE user_idx = ? ";
    pool.query(sql, [profile_data], (err,rows)=> {
      if (err) {
        reject(err)
      } else {
        if (rows.affectedRows == 1){ // 프사 변경 시도
          resolve(rows);
        } else {
          const _err = new Error("Profile img Edit Error");
          reject(_err);
        }
      }
    });
  })


};