// Requiring in router "db" json file and file system
const router = require("express").Router();
const db = require("../api/blog.json");
const fs = require("fs");

// Route to display all comments from db
// http://localhost:4004/blog/

router.get("/", (req, res) => {
  try {
    res.status(200).json({
      results: db,
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

// Display One blog post based on ID
// http://localhost:4004/blog/:post_id

router.get("/:post_id", (req, res) => {
  try {
    const id = req.params.post_id;

    let blogPost = db.filter((obj) => obj.post_id == id);

    res.status(200).json({
      status: `Found blog post at id: ${id}`,
      blogPost,
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

// Create new blog post to be added to blog.json file
// http://localhost:4004/blog/create

router.post("/create", (req, res) => {
  try {
    let { title, author, body } = req.body;

    let newID = db.length + 1;

    const newPost = {
      post_id: newID,
      title: title,
      author: author,
      body: body,
    };

    fs.readFile("./api/blog.json", (err, data) => {
      if (err) throw err;

      const database = JSON.parse(data);

      let currentIDs = [];

      database.forEach((post) => {
        currentIDs.push(post.post_id);
      });

      if (currentIDs.includes(newID)) {
        let maxValue = Math.max(...currentIDs);
        newID = maxValue + 1;
        newPost.post_id = newID;
      }

      database.push(newPost);

      fs.writeFile("./api/blog.json", JSON.stringify(database), (err) =>
        console.log(err)
      );

      res.status(200).json({
        staus: `Created new post: ${title}.`,
        newPost,
      });
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

// Update blog post entry by post ID
// http://localhost:4004/blog/:post_id
router.put("/:post_id", (req, res) => {
  try {
    const id = Number(req.params.post_id);

    const updatedPost = req.body;

    fs.readFile("./api/blog.json", (err, data) => {
      if (err) throw err;

      const database = JSON.parse(data);

      let post;

      database.forEach((obj, i) => {
        if (obj.post_id === id) {
          let buildPostObj = {};

          for (key in obj) {
            if (updatedPost[key]) {
              console.log("Checked");
              buildPostObj[key] = updatedPost[key];
            } else {
              buildPostObj[key] = obj[key];
            }
          }

          database[i] = buildPostObj;
          post = buildPostObj;
        }
      });

      if (Object.keys(post).length <= 0)
        res.status(404).json({ message: "No post found" });

      fs.writeFile("./api/blog.json", JSON.stringify(database), (err) =>
        console.log(err)
      );

      res.status(200).json({
        status: `Updated post at ID: ${id}.`,
        post: post,
      });
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

// Delete blog post by parameter post_id
// http://localhost:4004/blog/:post_id

router.delete("/:post_id", (req, res) => {
  try {
    const id = Number(req.params.post_id);

    fs.readFile("./api/blog.json", (err, data) => {
      if (err) throw err;

      const db = JSON.parse(data);

      const filteredDb = db.filter((i) => i.post_id !== id);

      fs.writeFile("./api/blog.json", JSON.stringify(filteredDb), (err) =>
        console.log(err)
      );

      res.status(200).json({
        status: `Your post at ID ${id} was successfully deleted.`,
      });
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

module.exports = router;
