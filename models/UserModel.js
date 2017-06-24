'use strict';

const mysql = require('mysql');
const DBConfig = require('./../config/DBConfig');
const pool = mysql.createPool(DBConfig);

const jwt = require('jsonwebtoken');
const config = require('../config/config');

/*******************
 *  Register
 *  @param: user_data = {user_name, user_password, user_email}
 ********************/

exports.register = (user_data) => {
  return new Promise((resolve, reject) => {
      const sql = "SELECT user_email FROM user WHERE user_email = ?";

      pool.query(sql, [user_data.user_email], (err, rows) => {  // 아이디 중복 체크
        if (err) {
          reject(err);
        } else {
          if (rows.length != 0) {  // 이미 아이디 존재
            reject(1201);
          }else{
            resolve(null);
          }
        }
      });
    }
  ).then(() => {
      return new Promise((resolve, reject) => {
        const sql = "INSERT INTO user SET ?";

        pool.query(sql, user_data, (err, rows) => {  // 가입 시도
          if (err) {
            reject(err);
          } else {
            if (rows.affectedRows == 1) {
              resolve(rows);
            } else {
              const _err = new Error("User Register Custom error");
              reject(_err);
            }
          }
        });
      });
    }
  ).then((result) => {
    return new Promise((resolve, reject) => {
      const sql =
        "SELECT user_idx, user_name, user_email, user_created_at " +
        "FROM user " +
        "WHERE user_idx = ?";

      pool.query(sql, result.insertId, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  });
};

/*******************
 *  Login
 *  @param: user_data = {user_id, user_password}
 ********************/
exports.login = (user_data) => {
  return new Promise((resolve, reject) => {
      const sql = "SELECT user_email FROM user WHERE user_email = ?";

      pool.query(sql, [user_data.user_email], (err, rows) => {  // 아이디 존재 검사
        if (err) {
          reject(err);
        } else {
          if (rows.length == 0) {  // 아이디 없음
            reject(1202);
          } else {
            resolve(null);
          }
        }
      });
    }
  ).then(() => {
    return new Promise((resolve, reject) => {
      const sql =
        "SELECT user_email, user_name " +
        "FROM user " +
        "WHERE user_email = ? and user_password = ?";

      pool.query(sql, [user_data.user_email, user_data.user_password], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          if (rows.length == 0) {  // 비밀번호 틀림
            reject(1203);
          } else {
            const profile = {
              email: rows[0].user_email,
              username: rows[0].user_name
            };
            const token = jwt.sign(profile, config.jwt.cert, {'expiresIn': "10h"});

            const result = {
              profile,
              token
            };

            resolve(result);
          }
        }
      });
    });
  });
};