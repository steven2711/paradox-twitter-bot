const Twit = require("twit");
const config = require("./config/config");
const { tweets } = require("./tweets");
const {
  unfollowPerson,
  filterUsers,
  getStatusAndAddToFriends,
  addFriend,
  getDataObject,
  getCurrentFriends,
  grabFollowingListAndRemoveNonFollowers,
  checkRelationshipAndUnfollow,
  postRandomTweet,
  unFollowPeople,
  unFollowOnePerson,
} = require("./functions");
const T = new Twit(config);

// 7 key phrases for a total of 350 friends per day

// Tweet user object: //

/////// followers_count /////
// Maybe start with only following people with 1000> followers

/////// friends_count /////
// Doesn't matter at the moment

/////// verified //////
// Doesn't matter at the moment

////// statuses_count /////
// I'd say accounts with over 100 posts would appear to be active. Eventually check time of posts.

////// following (T/F) //////
// Necessary to check

////// follow_request_sent (T/F) //////
// Necessary to check

const sixMinutes = 360000;
const fiveMinutes = 300000;
const tenMinutes = 600000;
const hour = 3600000;
const fiveHour = 18000000;
const twoHour = 7200000;
const threeHour = 10800000;
const day = 86400000;

////////////////////////// Get specified user pool and follow ////////////////////////

// getStatusAndAddToFriends(getDataObject, (response) => {
//   let filteredUsers = filterUsers(response);

//   console.log(filteredUsers.length);

//   let numberOfFilteredUsers = filteredUsers.length;

//   for (let i = 0; i < numberOfFilteredUsers; i++) {
//     (function (i) {
//       setTimeout(function () {
//         addFriend(filteredUsers[i]);
//       }, 5000 * i);
//     })(i);
//   }
// });

//////////////////////////////// Follow <100 people every five hours (max 400 per day) ////////////////////////////////

// setInterval(() => {
//   getStatusAndAddToFriends(getDataObject, (response) => {
//     let filteredUsers = filterUsers(response);

//     console.log(filteredUsers.length);

//     let numberOfFilteredUsers = filteredUsers.length;
//     let addInterval = numberOfFilteredUsers * 1000;

//     for (let i = 0; i < numberOfFilteredUsers; i++) {
//       (function (i) {
//         setTimeout(function () {
//           addFriend(filteredUsers[i]);
//         }, addInterval * i);
//       })(i);
//     }
//   });
// }, fiveHour * 2);

//////////////////////////////////// Unfollow one person every 10 minutes (144 per day up to 1000) //////////////////////////////////

//grabFollowingListAndRemoveNonFollowers();

/////////////////////////////// Post random tweet ////////////////////////

// note the start time
//

// postRandomTweet(tweets);

setInterval(() => {
  postRandomTweet(tweets);
}, fiveHour);

setInterval(() => {
  unFollowOnePerson();
}, tenMinutes);
