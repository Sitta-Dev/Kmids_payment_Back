const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const uuidv1 = require('uuid/v1');
const multer = require('multer');
const checkAuth = require('../middleware/check-auth');


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + file.originalname);
    }
});

const filefilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: filefilter
});



router.post('/anyactivityform', upload.single('imgexam'), checkAuth, async (req, res) => {
    var time = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
    const uuid = uuidv1('' + time);
    const status = "Pending";
    const img = req.file.path;
    const img2 = img.split("\\")[1]
    //const img2 = img.split("/")[1]
    const anyactivityform = {
        uuid_any_activity_check: uuid,
        uuid_invoice_billed: req.body.uuidinvicebill,
        payitem: req.body.payitem,
        student_id: req.body.studentid,
        studentname: req.body.studentname,
        grade: req.body.grade,
        acy: req.body.acy,
        date_paid: req.body.datepay,
        time_paid: req.body.timepay,
        amount: req.body.amount,
        img: img2,
        chance: req.body.chance,
        bank: req.body.bank,
        status
    };
    await pool.query('INSERT INTO any_activity_check set ?', [anyactivityform])
        .then(result => {
            if (result) {
                return res.status(200).json({
                    success: true,
                    message: "บันทึกเรียบร้อยเรียบร้อยแล้ว",

                });
            }
        })
        .catch(error => {
            if (error) {
                res.status(201).json({
                    success: false,
                    massage: error
                });
                // console.log(error);
            }
        });
});

const storageCustoms = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/forNewStudens/');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
});

const uploadCustoms = multer({
    storage: storageCustoms,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: filefilter
});

router.post('/anyactivityNewStudform', uploadCustoms.single('imgexam', 'foundation_name_autogen'), async (req, res) => {
    /** get time */
    var time = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');

    /** get nextval */
    const nextVal = await pool.query('SELECT MAX(student_id + 1) as student_id FROM kmids_payment.student_kmids');
    const $nextId = JSON.parse(JSON.stringify(nextVal))[0].student_id;

    /** get img Name */
    const imgPath = req.file.path;
    const imgSplit = imgPath.split("\\");
    const imgName = imgSplit[imgSplit.length - 1];

    /** set form */
    const anyactivityNewStudform = {
        student_id: $nextId,
        first_name: req.body.stud_first_name,
        last_name: req.body.stud_last_name,
        grade: req.body.stud_grade,

        fathers_frist_name: req.body.fathers_first_name,
        fathers_last_name: req.body.fathers_last_name,
        fathers_id: req.body.fathers_id,
        phone_fathers: req.body.fathers_phone,
        email_fathers: req.body.fathers_email,

        mothers_first_name: req.body.mothers_first_name,
        mothers_last_name: req.body.mothers_last_name,
        mothers_id: req.body.mothers_id,
        phone_mothers: req.body.mothers_phone,
        email_mothers: req.body.mothers_email
    };

    const anyactivityFoundationform = {
        uuid: $nextId,
        titlecheck: $nextId,
        status: $nextId,
        create_time: time,

        datepay: req.body.foundation_datepay,
        timepay: req.body.foundation_timepay,
        amount: req.body.foundation_amount,
        refid1: req.body.foundation_refid1,
        refid2: req.body.foundation_refid1,
        img: imgName,
    }

    Promise.all([
        pool.query('INSERT INTO student_kmids set ?', [anyactivityNewStudform]),
        pool.query('INSERT INTO admission_foundation set ?', [anyactivityFoundationform])
    ]).then(result => {
        if (result) {
            return res.status(200).json({
                success: true,
                message: "บันทึกเรียบร้อยเรียบร้อยแล้ว",
            });
        }
    }).catch(error => {
        if (error) {
            res.status(201).json({
                success: false,
                massage: error
            });
        }
    });
});

router.post('/autoGenFileName', async (req, res) => {
    const refID = req.body.refId;

    await pool.query('SELECT img FROM kmids_payment.admission_foundation WHERE LEFT(img, 13) = ' + `${refID}`)
        .then(result => {
            var data = refID;
            if (result.length) {
                data = `${refID}-${result.length}`;
            }

            return res.status(200).json({
                success: true,
                massage: 'Sucessfuly',
                data: data
            });
        }).catch(error => {
            if (error) {
                res.status(404).json({
                    massage: error
                });
            }
        });
});

router.post('/parent/anyactivity', checkAuth, async (req, res) => {
    const studentid = req.body.studentid;
    await pool.query('SELECT * FROM any_activity_check WHERE student_id = ?', [studentid])
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


router.get('/dashbord/anyactivity', checkAuth, async (req, res) => {
    const status = 'Pending';
    await pool.query('SELECT * FROM any_activity_check WHERE status = ?', [status])
        .then(result => {
            // console.log(result)
            if (result.length < 1) {
                return res.status(201).json({
                    success: false,
                    massage: 'not have a Pending'
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


router.post('/dashbord/anyactivity/show', checkAuth, async (req, res) => {
    const uuid = req.body.uuid;
    await pool.query('SELECT * FROM any_activity_check WHERE uuid_any_activity_check = ?', [uuid])
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

router.post('/dashbord/anyactivity', checkAuth, async (req, res) => {
    const getstudentid = req.body.studentid;
    const uuidpayment = req.body.uuidpayment;
    const realamount = req.body.realamount;
    const updateby = req.body.updateby;
    const status = 'Paid';
    await pool.query('UPDATE any_activity_check set status = ?, realamount = ? ,update_by = ?  WHERE student_id = ? AND uuid_any_activity_check = ? ', [status, realamount, updateby, getstudentid, uuidpayment])
        .then(result => {
            return res.status(200).json({
                success: true,
                massage: 'Sucessfuly',
                data: result
            });
        })
        .catch(error => {
            if (error) {
                res.status(404).json({
                    massage: error
                });
            }
        });
});

router.post('/dashbord/paidinvoicebill', checkAuth, async (req, res) => {
    const uuid_invoice_billed = req.body.uuid;
    const updateby = req.body.updateby;
    const status = 'Paid';
    await pool.query('UPDATE invoice_billed set status = ? ,update_by = ?  WHERE uuid_invoice_billed = ?  ', [status, updateby, uuid_invoice_billed])
        .then(result => {
            return res.status(200).json({
                success: true,
                massage: 'Sucessfuly',
                data: result
            });
        })
        .catch(error => {
            if (error) {
                res.status(404).json({
                    massage: error
                });
            }
        });
});




router.post('/dashbord/activity/payment/reject', checkAuth, async (req, res) => {
    const getstudentid = req.body.studentid;
    const uuidpayment = req.body.uuidpayment;
    const realamount = req.body.realamount;
    const comment = req.body.comment;
    const createby = req.body.createby;
    var time = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
    const uuidreject = uuidv1('' + time);
    const status = 'Not Complete';
    // console.log("i'am here");
    const rejectform = {
        uuid_reject_payment: uuidreject,
        uuid_payment: uuidpayment,
        comment: comment,
        create_by: createby,
    }

    const toupdate = await pool.query('UPDATE any_activity_check set status = ?, realamount = ?  ,update_by = ?  WHERE student_id = ? AND uuid_any_activity_check = ? ', [status, realamount, createby, getstudentid, uuidpayment]);
    const pushtodb = await pool.query('INSERT INTO reject_payment set ?', [rejectform]);
    // console.log(toupdate, pushtodb);

    if (toupdate && pushtodb) {
        return res.status(200).json({
            success: true,
            message: "บันทึกเรียบร้อยเรียบร้อยแล้ว",
        });
    } else {
        return res.status(200).json({
            success: false,
            message: "บันทึกเรียบร้อยไม่สำเร็จ",
        });
    }
});




router.post('/dashbord/anyactivity/approved', checkAuth, async (req, res) => {
    const payitem = req.body.payitem;
    const grade = req.body.grade;
    const acy = req.body.acy;
    const status = 'Paid';
    await pool.query('SELECT * FROM any_activity_check WHERE payitem = ? AND grade = ? AND  acy = ? AND status = ? ', [payitem, grade, acy, status])
        .then(result => {
            return res.status(200).json({
                success: true,
                massage: 'Sucessfuly',
                data: result
            });
        })
        .catch(error => {
            if (error) {
                res.status(404).json({
                    massage: error
                });
            }
        });
});



module.exports = router;