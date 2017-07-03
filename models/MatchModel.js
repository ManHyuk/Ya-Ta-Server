'use strict';

const mysql = require('mysql');
const DBConfig = require('./../config/DBConfig');
const pool = mysql.createPool(DBConfig);


exports.list = (match_data) =>{
  return new Promise((resolve, reject )=> {
    console.log(match_data);
    const sql =
      "SELECT applying_created_at, applying_message, user_name, user_img " +
      "FROM applying as a "+
      "LEFT JOIN user as u ON a.user_idx = u.user_idx "+
      "LEFT JOIN matching as m ON a.matching_idx = m.matching_idx "+
      "WHERE a.matching_idx = ?";
    pool.query(sql, [match_data.matching_idx],(err,rows)=>{
      if (err){
        reject(err);
      }else{
        resolve(rows);
      }
    });
  });
};

exports.register = (owner_data) => {
  return new Promise((resolve, reject) => {
    const sql = "INSERT INTO matching(user_idx, matching_slat, matching_slng, matching_sloc, matching_saddr, matching_elat, matching_elng, matching_eloc, matching_eaddr, matching_companion, matching_time, matching_message) " +
    "VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) ";

    pool.query(sql, [owner_data.owner_idx,
      owner_data.owner_slat,
      owner_data.owner_slng,
      owner_data.owner_sloc,
      owner_data.owner_saddr,
      owner_data.owner_elat,
      owner_data.owner_elng,
      owner_data.owner_eloc,
      owner_data.owner_eaddr,
      owner_data.owner_companion,
      owner_data.owner_time,
      owner_data.owner_message], (err, rows) => {
      if (err) {
        reject(err)
      } else {
        if (rows.affectedRows == 1){ // 차주 / 매칭 등록 시도

          resolve(rows);
        } else {
          const _err = new Error("Owner Match Register Error");
          reject(_err);
        }
      }
    });
  });
};

exports.confirmed = (confirm_data) => {
  return new Promise((resolve, rejcet) => {
    const sql =
      `
      
      `;

  });
};


exports.matching = (matching_data) => {
  return new Promise((resolve, reject) => {
    const sql =
      `
      UPDATE applying as a
      LEFT JOIN matching as m ON a.matching_idx = m.matching_idx
      SET a.applying_type = 1 , m.matching_type = 1
      WHERE a.applying_idx = ?
      `;
    pool.query(sql, [matching_data.a_idx], (err,rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });

  });
};

exports.finished = (finished_data) => {
  return new Promise((resolve, reject) => {
    const sql =
      `
      UPDATE applying as a
      LEFT JOIN matching as m ON a.matching_idx = m.matching_idx
      SET a.applying_type = 2 , m.matching_type = 2
      WHERE a.applying_idx = ?
      `;
    pool.query(sql, [], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
};




exports.detail = (detail_data) => {
  return new Promise((resolve, reject) => {

    const sql =
      `
      SELECT AVG (rating_star) as rating_star, applying_message, user_name, user_age, user_career, applying_companion
      FROM applying AS a
      LEFT JOIN user AS u ON a.user_idx = u.user_idx
      LEFT JOIN rating AS r ON r.receive_user_idx = a.user_idx WHERE applying_idx = ? 
      `;

    pool.query(sql, [detail_data.applying_idx], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
};



