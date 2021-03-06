const { response } = require('express');
const { Pool } = require('pg');
const dbParams = require('../../lib/db.js');
const db = new Pool(dbParams);
db.connect();

/**
 * @param {*} browseStory
 * @returns A function to browse all stories
 */
const browseStory = () => {
  return db.query("SELECT * FROM stories;")
    .then((response) => {
      return response.rows;
    })
    .catch((err) => console.log("Error for browseStory", err));
}

/**
 * @param {*} browseSelectStories
 * @returns A function that grabs all stories not related to the logged in user
 */
const browseSelectStories = (id) => {
  return db.query("SELECT * FROM stories WHERE NOT name_id = $1;", [id])
    .then((response) => {
      return response.rows;
    })
    .catch((err) => console.log("Error for browseSelectStories", err));
}

/**
 * @param {*} getStoryById
 * @returns A function that returns stories related to the current user logged in
 */
const getStoryById = (id) => {
  return db.query(`SELECT stories.*, users.name, contributions.text_addon,
  contributions.accepted_at FROM stories JOIN users ON
  users.id = stories.name_id
  JOIN contributions ON contributions.id = story_id
  WHERE stories.id = $1;`, [id])
  .then((response) => {
    return response.rows[0];
  })
  .catch((err) => console.log("Error for getStoryById", err));
}
//removed this line because it was throwing an ejs error, but it also solved a previous problem  'AND contributions.accepted_at = true'
//We changed querystring in attempt to get a story with its accepted contibution texts
// "SELECT stories.*, users.name FROM stories JOIN users ON users.id = stories.name_id WHERE stories.id = $1;"


/**
 * @param {*} addStory
 * @returns A function thats allows the user to create a story
 */
const addStory = function (story) {
  const queryString = `
  INSERT INTO stories
    (name_id, beginning_story, title, img_url, created_at, published, completed_at)
  VALUES ($1, $2, $3, $4, NOW(), FALSE, NULL)
  RETURNING *;
  `;

  const queryParams = [story.name_id, story.beginning_story, story.title, story.img_url]
  console.log(queryParams)
  return db.query(queryString, queryParams)
    .then(res => {
      return res.rows[0];
    })
    .catch((err) => console.log("Error for addStory", err));
}

/**
 * @param {*} updateStory
 * @returns A function that updates a existing story
 */
const updateStory = (id) => {
  const queryString = `UPDATE stories SET title = $1, beginning_story = $2, img_url = $3 WHERE name_id = $4
  RETURNING *;`
  const queryParams = [req.body.title, req.body.beginning_story, req.body.img_url, req.params.id]

  return db.query(queryString, queryParams)
    .then(() => {
      return console.log('WHAT DO WE DO!?')
    })
}

/**
 * @param {*} storyPublished
 * @returns Function that changes stories attribute published to TRUE
 */
const storyPublished = (storyId) => {
  const queryString = `UPDATE stories SET published = TRUE WHERE id = $1;`
  return db.query(queryString, [storyId])
}


module.exports = {
  browseStory,
  getStoryById,
  addStory,
  browseSelectStories,
  updateStory,
  storyPublished
}
