const { Router } = require("express");
const adminMiddleware = require("../middleware/admin");
const router = Router();
const {Admin, Course} = require("../db/index");
const jwt = require('jsonwebtoken');
require('dotenv').config()
// Admin Routes

router.post('/signup', async(req, res) => {
    // Implement admin signup logic
    await Admin.create({
        username: req.body.username,
        password: req.body.password
    })
    res.json({
        message: 'Admin created successfully'
    })
});

router.post('/signin', async(req, res) => {
    // Implement admin signup logic
    const username = req.body.username;
    const password = req.body.password;

    const checkUsername = await Admin.findOne({ username: username });
    const checkPassword = await Admin.findOne({password: password});

    if(checkUsername !== null && checkPassword !== null){
        var token = jwt.sign({ username: username }, process.env.jwtPassword);
        res.json(token);
    } else {
    res.json({message: "Username or password not valid"});
    }
});

router.post('/courses', adminMiddleware, async(req, res) => {
    // Implement course creation logic
    const newCourse = await Course.create({
        title: req.body.title,
        description: req.body.description,
        price: req.body.price,
        imageLink: req.body.imageLink
    })
    res.json({
        message: 'Course created successfully', 
        courseId: newCourse._id
    })
});

router.get('/courses', adminMiddleware, async(req, res) => {
    // Implement fetching all courses logic
    const allCourses = await Course.find({});
    res.json({courses: allCourses});
});

module.exports = router;