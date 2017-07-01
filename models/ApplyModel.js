'use strict';

const mysql = require('mysql');
const DBConfig = require('./../config/DBConfig');
const pool = mysql.createPool(DBConfig);

exports.search = (search_data) => {
  return new Promise((resolve, reject) => {

    const sql =
      "SELECT u.user_name, u.user_img, m.matching_sloc, m.matching_eloc, m.matching_message, m.matching_companion,m.matching_created_at " +
    "FROM matching as m " +
    "LEFT JOIN user as u ON m.user_idx = u.user_idx " +
    "WHERE m.matching_sloc REGEXP ? AND m.matching_eloc REGEXP ?" ;

    pool.query(sql, [search_data.sloc, search_data.eloc], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
};

exports.apply = (apply_data) => {
  return new Promise((resolve, reject) => {
    const sql =
      "INSERT INTO applying(user_idx, matching_idx, applying_message) " +
      "VALUES (?, ?, ?) ";
    pool.query(sql, [apply_data.user_idx, apply_data.matching_idx, apply_data.apply_message], (err, rows) => {
     if (err){
       reject(err)
     } else {
       if (rows.affectedRows == 1){ // 운전자 => 차주 매칭 신청 시도
         resolve(rows);
       } else {
         const _err = new Error("Owner Match Register Error");
         reject(_err);
       }
     }
    });
  });
};


exports.detail = (detail_data) => {
  return new Promise((resolve, reject) => {

    const sql =
      "SELECT AVG (rating_star) AS rating_star, matching_sloc, matching_eloc, user_name, user_age, matching_companion, matching_message, user_car "+
      "FROM matching AS m " +
      "LEFT JOIN user AS u ON m.user_idx = u.user_idx "+
      "LEFT JOIN rating AS r ON r.receive_user_idx = m.user_idx WHERE matching_idx = ? "

    pool.query(sql, [detail_data.matching_idx], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
};
