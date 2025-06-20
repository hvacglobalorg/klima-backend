const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Project = require('../models/Project');
const verifyToken = require('../middleware/verifyToken');

const ADMIN_EMAIL = 'hvacglobalorg@gmail.com';

router.get('/users-projects', verifyToken, async (req, res) => {
  if (req.user.username !== 'admin') {
    return res.status(403).json({ message: 'Yalnızca admin erişebilir.' });
  }

  try {
    const users = await User.find({}, 'username email');
    const projects = await Project.find();

    const result = users.map(user => ({
      username: user.username,
      email: user.email,
      projects: projects.filter(p => p.userId.toString() === user._id.toString()),
    }));

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: 'Sunucu hatası', error: err.message });
  }
});

module.exports = router;
