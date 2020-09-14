const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const uuidv1 = require('uuid/v1');
const checkAuth = require('../middleware/check-auth');


router.post('/dashbord/myinvoice', checkAuth, async (req, res) => {
    const getuuid = req.body.uuid;
    await pool.query('SELECT * FROM invoice_master WHERE create_by = ?', [getuuid])
        .then(result => {
            // console.log(result)
            if (result.length < 1) {
                return res.status(201).json({
                    success: false,
                    massage: 'not have a data'
                });
            } else {
                return res.status(200).json({
                    success: true,
                    massage: 'Sucessfuly',
                    data: result
                });
            }
        })
        .catch(error => {
            if (error) {
                res.status(404).json({
                    massage: error
                });
            }
        });
});

router.post('/dashbord/getdataall', checkAuth, async (req, res) => {
    const getuuid = req.body.uuid;
    await pool.query('SELECT * FROM invoice_billed, student_kmids WHERE invoice_billed.studentid = student_kmids.student_id AND uuid_invoice_master=?', [getuuid])
        .then(result => {
            // console.log(result)
            if (result.length < 1) {
                return res.status(201).json({
                    success: false,
                    massage: 'not have a data'
                });
            } else {
                return res.status(200).json({
                    success: true,
                    massage: 'Sucessfuly',
                    data: result
                });
            }
        })
        .catch(error => {
            if (error) {
                res.status(404).json({
                    massage: error
                });
            }
        });
});

router.post('/dashbord/getdatapaid', checkAuth, async (req, res) => {
    const getuuid = req.body.uuid;
    const status = 'Paid';
    await pool.query('SELECT * FROM invoice_billed, student_kmids WHERE invoice_billed.studentid = student_kmids.student_id AND uuid_invoice_master=? AND status = ?', [getuuid, status])
        .then(result => {
            // console.log(result)
            if (result.length < 1) {
                return res.status(201).json({
                    success: false,
                    massage: 'not have a data'
                });
            } else {
                return res.status(200).json({
                    success: true,
                    massage: 'Sucessfuly',
                    data: result
                });
            }
        })
        .catch(error => {
            if (error) {
                res.status(404).json({
                    massage: error
                });
            }
        });
});

router.post('/dashbord/getdatabill', checkAuth, async (req, res) => {
    const getuuid = req.body.uuid;
    const status = 'bill';
    await pool.query('SELECT * FROM invoice_billed, student_kmids WHERE invoice_billed.studentid = student_kmids.student_id AND uuid_invoice_master=? AND status = ?', [getuuid, status])
        .then(result => {
            // console.log(result)
            if (result.length < 1) {
                return res.status(201).json({
                    success: false,
                    massage: 'not have a data'
                });
            } else {
                return res.status(200).json({
                    success: true,
                    massage: 'Sucessfuly',
                    data: result
                });
            }
        })
        .catch(error => {
            if (error) {
                res.status(404).json({
                    massage: error
                });
            }
        });
});

router.post('/getdataparentall', checkAuth, async (req, res) => {
    const studentid = req.body.studentid;
    await pool.query('SELECT * FROM student_kmids WHERE student_id = ?', [studentid])
        .then(result => {
            if (result.length < 1) {
                return res.status(202).json({
                    success: false,
                    message: "not have student ID"
                });
            } else {
                const data = {
                    fathers_name: result[0].fathers_frist_name + " " + result[0].fathers_last_name,
                    phone_fathers: result[0].phone_fathers,
                    email_fathers: result[0].email_fathers,
                    mothers_name: result[0].mothers_first_name + " " + result[0].mothers_last_name,
                    phone_mothers: result[0].phone_mothers,
                    email_mothers: result[0].email_mothers,
                };
                return res.status(200).json({
                    success: true,
                    data: data
                });
            }
        });
});


module.exports = router;