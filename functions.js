const Twit = require("twit");
const config = require("./config/config");
const T = new Twit(config);

//////////////////////////// Adjustables //////////////////////////////

let dailyKeywords = ["logical reasoning", "critical thinking", "philosophy", "theories", "paradox", "science", "abstract"];

const getDataObject = {
  q: dailyKeywords[4],
  count: 100, // max call
  lang: "en",
  result_type: "recent",
};

///////////////////////////////////////////////////////////////////////////

function unfollowPerson(user) {
  T.post("friendships/destroy", { user_id: user.id, screen_name: user.screen_name }, function (err, data, response) {
    if (err) {
      console.log(err, "Error in unfollowPerson");
    }
    console.log(`You unfollowed ${user.screen_name}`);
  });
}

function addFriend(user) {
  T.post("friendships/create", { user_id: user.user_id, screen_name: user.screen_name }, function (err, data, response) {
    if (err) {
      console.log(err);
    } else {
      console.log(`Added ${user.screen_name} to your friends list!`);
    }
  });
}

function filterUsers(users) {
  let filteredUsers = [];

  ////// Filter citeria ///////
  const criteria = {
    followers_count: 1000,
    statuses_count: 100,
    following: false,
    follow_request_sent: false,
  };

  users.forEach((user) => {
    if (
      user.followers_count > criteria.followers_count &&
      user.statuses_count > criteria.statuses_count &&
      user.following === criteria.following &&
      user.follow_request_sent === criteria.follow_request_sent
    ) {
      filteredUsers.push(user);
    }
  });

  return filteredUsers;
}

function getStatusAndAddToFriends(data, callback) {
  T.get("search/tweets", getDataObject, function (err, data, response) {
    let friendsList = [];

    if (err) {
      console.log("Error in the GET function");
      callback(err);
    }

    let tweets = data.statuses;

    tweets.forEach((tweet) => {
      friendsList.push({
        user_id: tweet.user.id,
        screen_name: tweet.user.screen_name,
        text: tweet.text,
        followers_count: tweet.user.followers_count,
        statuses_count: tweet.user.statuses_count,
        following: tweet.user.following,
        follow_request_sent: tweet.user.follow_request_sent,
      });
    });

    callback(friendsList);
  });
}

function grabFollowingListAndRemoveNonFollowers() {
  let cursor = -1;
  let followingList = [];
  let listMultiple = 5; // A list of 1000 people
  let forLoopTimer = 60000;

  // The list multiple is used to calcultae the size of the following list you would like to grab. Basically, listMultiple * 200

  for (let i = 0; i < listMultiple; i++) {
    (function (i) {
      setTimeout(function () {
        getCurrentFriends(cursor)
          .then((data) => {
            cursor = data.newCursor;
            data.friends.forEach((friend) => followingList.unshift(friend));
          })
          .catch((error) => console.log(error));
      }, i * forLoopTimer);
    })(i);
  }

  // The function below is set to allow the function above to complete before running.

  setTimeout(() => {
    console.log(`Friends list built with ${followingList.length} following. Now starting the removal process...`);

    let time = followingList.length;

    for (let i = 0; i < time; i++) {
      (function (i) {
        setTimeout(function () {
          checkRelationshipAndUnfollow(followingList[i]);
          console.log(i);
        }, i * 600000);
      })(i);
    }
  }, forLoopTimer * listMultiple + 60000);
}

async function unFollowPeople() {
  let count = 10;
  let cursor = -1;
  let friendList;

  friendList = await getCurrentFriends(cursor, count);

  console.log(friendList);
}

async function unFollowOnePerson() {
  let count = 1;
  let cursor = -1;
  let friendList;

  friendList = await getCurrentFriends(cursor, count);

  let friend = friendList.friends[0];

  unfollowPerson(friend);
}

function getCurrentFriends(cursor, count) {
  return new Promise((resolve, reject) => {
    T.get("friends/list", { cursor: cursor, count: count }, function (err, data, response) {
      if (err) reject(err);

      let namesAndIds = [];
      let nextCursor = data.next_cursor;

      data.users.forEach((user) => {
        namesAndIds.push({
          id: user.id_str,
          screen_name: user.screen_name,
          following: user.following,
        });
      });

      resolve({ friends: namesAndIds, newCursor: nextCursor });
    });
  });
}

function checkRelationshipAndUnfollow(friend) {
  T.get(
    "friendships/show",
    {
      target_id: friend.id,
      target_screen_name: friend.sreen_name,
    },
    function (err, data, response) {
      if (err) {
        console.log(err, `Error in check relationship. Cannot find ${friend}`);
      }

      if (!err) {
        if (!data.relationship.source.followed_by) {
          unfollowPerson(friend);
        } else if (data.relationship.source.followed_by) {
          console.log(`${friend.screen_name} is following you!`);
        } else {
          console.log("No relation with user");
        }
      }
    }
  );
}

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function postRandomTweet(tweets) {
  function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }

  const randomNumber = getRandomInt(tweets.length);
  const tweet = tweets[randomNumber];
  const hashtags = tweet.hashtags.join(" ");

  const status = {
    status: `${tweet.tweet} ${hashtags}`,
  };

  T.post("statuses/update", status, function (err, data, response) {
    if (err) console.log(err);

    console.log("Successfully posted a tweet!");
  });
}

exports.postRandomTweet = postRandomTweet;
exports.grabFollowingListAndRemoveNonFollowers = grabFollowingListAndRemoveNonFollowers;
exports.getStatusAndAddToFriends = getStatusAndAddToFriends;
exports.filterUsers = filterUsers;
exports.unFollowPeople = unFollowPeople;
exports.unfollowPerson = unfollowPerson;
exports.unFollowOnePerson = unFollowOnePerson;
exports.addFriend = addFriend;
exports.getDataObject = getDataObject;
exports.getCurrentFriends = getCurrentFriends;
exports.checkRelationshipAndUnfollow = checkRelationshipAndUnfollow;
