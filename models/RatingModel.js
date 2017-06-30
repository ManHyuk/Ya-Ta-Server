'use strict';

const mysql = require('mysql');
const DBConfig = require('./../config/DBConfig');
const pool = mysql.createPool(DBConfig);

exports.write = (rating_data) => {
  return new Promise((resolve, reject) => {

    const sql =
      "INSERT INTO rating(send_user_idx, receive_user_idx, rating_star) " +
      "VALUES (?, ?, ?) ";

    pool.query(sql, [rating_data.sender_idx, rating_data.receiver_idx, rating_data.rating_star], (err,rows) => {
      if (err) {
        reject(err)
      } else {
        if (rows.affectedRows == 1){ // 별점 주기 시도
          resolve(rows);
        } else {
          const _err = new Error("Rating Star Write Error");
          reject(_err);
        }
      }
    });
  });
};