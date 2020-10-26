const { Router } = require('express');
const router = Router();

//Token
const verify = require('./verifyToken');



router.get('/', verify ,(req, res) => {
    res.json({posts:{
        "title": "The post",
        "description": "Random data"
    }})
})








module.exports = router;