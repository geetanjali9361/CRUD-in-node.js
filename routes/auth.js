const express = require('express');
const router = express.Router();
const members = require("../controller/members")

// Route definition
router.get('/', (req, res) => {
    res.status(200).json({ message: "The server is running" });
});

router.post('/sign-up', members.createUser)
router.get('/read-user', members.readUser)
router.post('/update-user', members.updateUser)
router.post('/delete-user',members.deleteUser)

module.exports = router;