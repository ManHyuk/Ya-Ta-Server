'use strict';


const authCtrl = require('../controllers/AuthCtrl');
const userCtrl = require('../controllers/UserCtrl');
const matchCtrl = require('../controllers/MatchCtrl');
const applyCtrl = require ('../controllers/ApplyCtrl');
const ratingCtrl = require('../controllers/RatingCtrl');
const profileCtrl = require('../controllers/ProfileCtrl');

module.exports = (router) => {

  // USER
  router.route('/user/register')
    .post(userCtrl.register); // 회원가입
  router.route('/user/login')
    .post(userCtrl.login); // 로그인

  // PROFILE ( MyPage )
  router.route('/profile')
    .get(authCtrl.auth, profileCtrl.inform)
    .put(authCtrl.auth, profileCtrl.uploadImage, profileCtrl.updating); // 수정



  // OWNER ( Match )
  router.route('/owner/match/register')
    .post(authCtrl.auth, matchCtrl.register); // 차주 / 매칭 신청
  router.route('/owner/match/list/:matching_idx')
    .get(authCtrl.auth, matchCtrl.list); // 차주 / 운전자 신청 조회
  router.route('/owner/match/detail/:applying_idx')
    .get(authCtrl.auth, matchCtrl.detail); // 차주 / 운전자 상세보기

  // DRIVER ( Apply )
  router.route('/driver/apply/:matching_idx')
    .post(authCtrl.auth, applyCtrl.apply); // 운전자 / 매칭 신청
  router.route('/driver/search/:sloc/:eloc')
    .get(authCtrl.auth, applyCtrl.search); // 운전자 / 차주 검색

  router.route('/driver/detail/:matching_idx') // TODO 로직 확인
    .get(authCtrl.auth, applyCtrl.detail); // 운전자 / 차주 상세보기

  // RATING
  router.route('/owner/rating/:receiver_idx') // 차주 => 운전자
    .post(authCtrl.auth, ratingCtrl.write);
  router.route('/driver/rating/:receiver_idx') // 운전자 => 차주
    .post(authCtrl.auth, ratingCtrl.write);




  return router;
};
