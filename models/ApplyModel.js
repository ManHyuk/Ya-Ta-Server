'use strict';

const mysql = require('mysql');
const DBConfig = require('./../config/DBConfig');
const pool = mysql.createPool(DBConfig);



exports.list = (list_data) => {
  return new Promise((resolve, reject) => {
    const sql =
      `
      SELECT

        m.matching_idx,
        a.applying_idx,
        u.user_name,
        m.matching_sloc,
        m.matching_eloc,
        m.matching_saddr,
        m.matching_eaddr,
        m.matching_message,
        m.matching_time

      FROM matching AS m
        LEFT JOIN applying AS a ON m.matching_idx = a.matching_idx
        LEFT JOIN user AS u ON m.user_idx = u.user_idx
      WHERE a.user_idx = ?
      `;

    pool.query(sql, [list_data.u_idx], (err,rows) => {
      if (err) {
        reject(err)
      }else{
        resolve(rows)
      }
    });
  });
};


exports.search = (search_data) => {
  return new Promise((resolve, reject) => {
    const sql =
      "SELECT m.matching_idx, u.user_name, u.user_img, m.matching_sloc, m.matching_eloc, m.matching_message, m.matching_companion, m.matching_saddr, m.matching_eaddr, m.matching_created_at " +
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
      "INSERT INTO applying(user_idx, matching_idx, applying_message, applying_companion) " +
      "VALUES (?, ?, ?, ?) ";
    pool.query(sql, [apply_data.user_idx, apply_data.matching_idx, apply_data.apply_message, apply_data.apply_companion], (err, rows) => {
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
  }).then(() => { // apply시 matching 상태 1로 변경
    return new Promise((resolve, reject) => {
      const sql =
        `
        UPDATE matching
        SET matching_type = 1
        WHERE matching_idx = ?
        `;
      pool.query(sql, [apply_data.matching_idx], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    }).then(() => {
      return new Promise((resolve, reject) => {
        const sql =
          `
          SELECT a.matching_idx, a.applying_idx
          FROM applying AS a
          WHERE a.user_idx = ?
          `;

        pool.query(sql, [apply_data.user_idx], (err,rows) => {
          if (err){
            reject(err)
          } else {
            resolve(rows[0])
          }
        });

      });
    });
  })
};


// exports.approved = (approved_data) => {
//   return new Promise((resolve, reject) => {
//     const sql =
//       `
//       UPDATE matching
//       SET matching_type = 2
//       WHERE matching_idx = ?
//       `;
//
//     pool.query(sql, [approved_data.m_idx], (err, rows) => {
//       if (err) {
//         reject(err)
//       } else {
//         resolve(rows)
//       }
//     });
//   });
//
// };

exports.completed = (completed_data) => {
  return new Promise((resolve, reject) => {
    const sql =
      `
      UPDATE applying AS a
      SET a.applying_type = 2
      WHERE a.applying_idx = ?
      `;

    console.log(completed_data);
    pool.query(sql, [completed_data.a_idx], (err,rows) => {
      if(err){
        reject(err)
      }else{
        resolve(rows)
      }
    });
  });
};

exports.finished = (finished_data) => {
  return new Promise((resolve, reject) => {

    const sql =
      `
      UPDATE applying
      SET applying_type = 3
      WHERE applying_idx = ?
      `;
    pool.query(sql, [finished_data.a_idx], (err, rows) => {
      if (err) {
        reject(err)
      }else {
        resolve(rows)
      }
    });
  }).then(() => {
    return new Promise((resolve, reject) => {
      const sql =
        `
        SELECT a.matching_idx, a.applying_idx, m.user_idx, a.applying_type
        FROM applying AS a
          LEFT JOIN matching AS m ON a.matching_idx = m.matching_idx
        WHERE a.applying_idx = ?        
        `;

      pool.query(sql, [finished_data.a_idx], (err,rows) => {
        if(err){
          reject(err)
        }else {
          resolve(rows)
        }
      });
    });
  });
};

exports.detail = (detail_data) => {
  return new Promise((resolve, reject) => {

    const sql =
      "SELECT m.matching_idx, AVG (rating_star) AS rating_star, matching_sloc, matching_eloc, user_name, user_age, matching_companion, matching_message, user_car "+
      "FROM matching AS m " +
      "LEFT JOIN user AS u ON m.user_idx = u.user_idx "+
      "LEFT JOIN rating AS r ON r.receive_user_idx = m.user_idx WHERE matching_idx = ? ";

    pool.query(sql, [detail_data.matching_idx], (err, rows) => {
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

    const sql =
    "SELECT DISTINCT rating_star, m.matching_idx, user_img, user_name, matching_sloc, matching_eloc, matching_time "+
    "FROM applying as a "+
    "LEFT JOIN matching as m ON m.matching_idx = a.matching_idx "+
    "LEFT JOIN user as u ON u.user_idx = m.user_idx "+
    "LEFT JOIN rating as r ON r.receive_user_idx = m.user_idx "+
    "WHERE (a.user_idx = ?) AND (matching_type =3) ";

    pool.query(sql, [inquiry_data.user_idx],(err,rows)=>{
      if(err){
        reject(err);

      }else{
        resolve(rows);
      }
    });

  });
};
