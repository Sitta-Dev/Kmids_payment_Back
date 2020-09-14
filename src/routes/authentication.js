const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const uuidv1 = require('uuid/v1');
const bcrypt = require('bcrypt');
var sha1 = require('sha1');
const jwt = require('jsonwebtoken');
const env = process.env.JWT_KEY || 'database';
const config = require('../config/keys')[env];
const checkAuth = require('../middleware/check-auth');



router.post('/adduser', async (req, res) => {
    var time = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
    const uuid = uuidv1('' + time);
    const salt = "kmids2020";
    const password = req.body.password;
    const tohash = salt + "" + password;
    const hash = sha1(tohash);
    const getdata = {
        uuid,
        username: req.body.username,
        email: req.body.email,
        password: hash,
        role: req.body.role,
    };
    console.log('getdata : ', getdata)
    await pool.query('INSERT INTO user_kmids set ?', [getdata])
        .then(result => {
            console.log(result);
            res.status(200).json({
                message: 'User created'
            })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });

});


router.post('/loginstaff', async (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const salt = "kmids2020";
    const tohash = salt + "" + password;
    const hash = sha1(tohash);
    console.log('hash : ', hash)
    await pool.query('SELECT * FROM user_kmids WHERE email = ?', [email])
        .then(async result => {
            if (result.length < 1) {
                return res.status(404).json({
                    message: 'not found email',
                });
            } else {
                console.log('result : ', result)
                if (result[0].password === hash) {
                    const token = jwt.sign({
                        uuid: result[0].uuid,
                        email: result[0].email,
                        role: result[0].role
                    },
                        config.JWT_KEY, {
                        expiresIn: "1h"
                    });
                    const data = {
                        uuid: result[0].uuid,
                        email: result[0].email,
                        username: result[0].username,
                        role: result[0].role
                    };
                    return res.status(200).json({
                        success: true,
                        data: data,
                        token: token,
                        message: "ล็อคอินเรียบร้อยแล้ว"
                    });

                } else {
                    return res.status(202).json({
                        message: 'password not math',
                    });
                }
            }
        })
        .catch(error => {
            if (error) {
                res.send({
                    code: 400,
                    failed: "Error ocurred",
                    data: error
                });
            }
        });
});

router.post('/loginparent', async (req, res, next) => {
    const studentid = req.body.studentid;
    const parentid = req.body.parentid;
    await pool.query('SELECT * FROM student_kmids WHERE student_id = ?', [studentid])
        .then(result => {
            if (result.length < 1) {
                return res.status(202).json({
                    success: false,
                    message: "not have student ID"
                });
            } else {
                if (parentid === result[0].fathers_id) {
                    const token = jwt.sign({
                        studentid: result[0].student_id,
                        grade: result[0].grade,
                    },
                        config.JWT_KEY, {
                        expiresIn: "1h"
                    }
                    );
                    const data = {
                        studentid: result[0].student_id,
                        studant_name: result[0].first_name + " " + result[0].last_name,
                        grade: result[0].grade,
                        parent_name: result[0].fathers_frist_name + " " + result[0].fathers_last_name
                    };
                    return res.status(200).json({
                        success: true,
                        data: data,
                        token: token,
                        message: "ล็อคอินเรียบร้อยแล้ว"
                    });
                }
                if (parentid === result[0].mothers_id) {
                    const token = jwt.sign({
                        studentid: result[0].student_id,
                        grade: result[0].grade,
                    },
                        config.JWT_KEY, {
                        expiresIn: "1h"
                    }
                    );
                    const data = {
                        studentid: result[0].student_id,
                        studant_name: result[0].first_name + " " + result[0].last_name,
                        grade: result[0].grade,
                        parent_name: result[0].mothers_first_name + " " + result[0].mothers_last_name
                    };
                    return res.status(200).json({
                        success: true,
                        data: data,
                        token: token,
                        message: "ล็อคอินเรียบร้อยแล้ว"
                    });
                }
                if (parentid !== result[0].mothers_id && parentid !== result[0].fathers_id) {
                    return res.status(201).json({
                        success: false,
                        message: "รหัสประชาชนท่านผิดพลาด"
                    });
                }
            }
        })
        .catch(error => {
            if (error) {
                res.send({
                    code: 400,
                    failed: "Error ocurred",
                    data: error
                });
            }
        });
});


module.exports = router;