'use strict';

const mysql = require('mysql');
const DBConfig = require('./../config/DBConfig');
const pool = mysql.createPool(DBConfig);

exports.owner = (owner_data) => {
  return new Promise((resolve, reject) => {
    const sql =
      `
      SELECT
        m.matching_idx, 
        u.user_name,
        u.user_type
      FROM matching AS m
        LEFT JOIN user AS u ON m.user_idx = u.user_idx
      WHERE m.user_idx=?
      `;
    pool.query(sql, [owner_data.user_idx], (err,rows) => {
      if(err){
        reject(err)
      }else{
        resolve(rows[0])
      }
    });
  });

};

exports.list = (match_data) =>{
  return new Promise((resolve, reject )=> {

    const sql =
      "SELECT a.applying_idx, m.matching_idx, applying_created_at, applying_message, user_name, user_img " +
      "FROM applying as a "+
      "LEFT JOIN user as u ON a.user_idx = u.user_idx "+
      "LEFT JOIN matching as m ON a.matching_idx = m.matching_idx "+
      "WHERE a.matching_idx = ? ";
    pool.query(sql, [match_data.matching_idx],(err,rows)=>{
      if (err){
        reject(err);
      }else{
        resolve(rows);
      }
    });
  });
};

exports.register = (owner_data, user_idx) => {
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

          resolve(null);
        } else {
          const _err = new Error("Owner Match Register Error");
          reject(_err);
        }
      }
    });
  }).then(() => {
    return new Promise((resolve, reject) => {
      const sql =
        `
        UPDATE user AS u 
          SET u.user_type =1
        WHERE u.user_idx = ?;
        `;
      pool.query(sql, [user_idx], (err,rows) => {
        if (err) {
          reject(err)
        } else {
          resolve(rows)
        }
      });
    });
  })
};

exports.approved = (approved_data) => {
  return new Promise((resolve, reject) => {

    const sql =
      `
      UPDATE applying AS a
      LEFT JOIN matching AS m ON a.matching_idx = m.matching_idx
      SET a.applying_type = 1 , m.matching_type = 2
      WHERE a.applying_idx = ?
      `;

    pool.query(sql, [approved_data.a_idx], (err,rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(approved_data.a_idx);
      }
    });
  }).then((approved_data) => {
    return new Promise((resolve, reject) => {
      const sql =
        `
        SELECT
          a.applying_idx,
          a.matching_idx,
          u.user_name,
          u.user_age,
          r.rating_star,
          a.applying_companion,
          u.user_career,
          a.applying_message,
          a.applying_type

        FROM applying AS a
          LEFT JOIN user AS u ON a.user_idx = u.user_idx
          LEFT JOIN matching As m ON a.matching_idx = m.matching_idx
          LEFT JOIN rating AS r ON a.user_idx = r.receive_user_idx
        WHERE a.applying_idx = ?
        `;

      console.log(approved_data);
      pool.query(sql, [approved_data], (err, rows) => {
        if(err){
          reject(err)
        } else {
          resolve(rows[0])
        }
      });
    })
  });
};


// FIXME 쿼리수정
exports.completed = (completed_data) => {
  return new Promise((resolve, reject) => {
    const sql =
      `
      UPDATE applying as a
        LEFT JOIN matching as m ON a.matching_idx = m.matching_idx
      SET m.matching_type = 2
      WHERE a.applying_idx = ?
      `;
    pool.query(sql, [completed_data.a_idx], (err,rows) => {
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
      UPDATE matching as m
        LEFT JOIN user AS u ON m.user_idx = u.user_idx
      SET m.matching_type = 3, u.user_type = 0
      WHERE m.matching_idx = ?
      `;
    pool.query(sql, [finished_data.m_idx], (err, rows) => {
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
      SELECT a.applying_idx, AVG (rating_star) as rating_star, applying_message, user_name, user_age, user_career, applying_companion
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


// 매칭 이력 조회
exports.inquiry = (inquiry_data)=> {
  return new Promise((resolve, reject) => {
    //applying_idx와 a.matching_idx 는 확인결과를 위한 값이므로 삭제해도 가능
    const sql =
    "SELECT DISTINCT applying_idx, a.matching_idx, user_img, user_name, matching_sloc, matching_eloc, matching_time "+
    "FROM matching as m " +
    "LEFT JOIN applying as a ON m.matching_idx = a.matching_idx "+
    "LEFT JOIN user as u ON u.user_idx = a.user_idx "+
    "WHERE (m.user_idx = ?) AND (applying_type =3) ";
    // Q. applying_type = 3인값만 필요한지 AND 조건 달아서 matching_type =3인것도 확인해야 하는지

    pool.query(sql, [inquiry_data.user_idx],(err,rows)=>{
      if(err){
        reject(err);

      }else{
        resolve(rows);
      }
    });

  });
};
