'use strict';

const mysql = require('mysql');
const DBConfig = require('./../config/DBConfig');
const pool = mysql.createPool(DBConfig);


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


