const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const uuidv1 = require('uuid/v1');
const multer = require('multer');
const checkAuth = require('../middleware/check-auth');


const storage = multer.diskStorage({
    destination:function(req, file,cb){
        cb(null,'./uploads/');
    },
    filename:function(req,file,cb){
        cb(null,Date.now()+file.originalname);
    }
});

const filefilter = (req,file,cb)=>{
    //reject a file
    if(file.mimetype === 'image/jpeg'|| file.mimetype ==='image/png'){
        cb(null, true);
    }else{
        cb(null, false);
    }
};

const upload = multer({
    storage: storage, 
    limits:{
    fileSize:1024 * 1024 *5 
    },
    fileFilter: filefilter
});


router.get('/',(req, res) =>{
    res.send('hello admission');
});

router.post('/examinationfee',upload.single('imgexam'),async(req, res)=>{
    var time = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
    const uuid = uuidv1(''+time);
    const status = "Pending";
    console.log(uuid);
    const img = req.file.path;
    const img2 = img.split("\\")[1]
    const examinationfee = {
        uuid,
        titlecheck : req.body.titlecheck, 
        refid1: req.body.refid1, 
        refid2: req.body.refid2, 
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        grad: req.body.grad,
        round: req.body.round,
        acy: req.body.acy,
        datepay: req.body.datepay,
        timepay: req.body.timepay,
        amount: req.body.amount,
        img:img2,
        chance: req.body.chance,
        bank: req.body.bank,
        status
    };
    await pool.query('INSERT INTO admission_examinationfee set ?',[examinationfee]);
    res.status(200).json({
        success: true,
        data:examinationfee
    });
});


router.post('/tuitionfee',upload.single('imgexam'),async(req, res)=>{
    var time = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
    const uuid = uuidv1(''+time+''+req.body.titlecheck+''+req.body.amount);
    const status = "Pending";
    console.log(uuid);
    const img = req.file.path;
    const img2 = img.split("\\")[1]

    const tuitionfee = {
        uuid,
        titlecheck : req.body.titlecheck, 
        refid1: req.body.refid1, 
        refid2: req.body.refid2, 
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        grad: req.body.grad,
        round: req.body.round,
        acy: req.body.acy,
        datepay: req.body.datepay,
        timepay: req.body.timepay,
        amount: req.body.amount,
        img:img2,
        chance: req.body.chance,
        bank: req.body.bank,
        status
    };
    await pool.query('INSERT INTO admission_tuition_fee set ?',[tuitionfee])
    res.status(200).json({
        success: true,
        data:tuitionfee
    });
});

router.post('/developmentfund',upload.single('imgdeve'),async(req, res)=>{
    var time = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
    const uuid = uuidv1(''+time+''+req.body.titlecheck+''+req.body.amount);
    const status = "Pending";
    console.log(uuid);
    const img = req.file.path;
    const img2 = img.split("\\")[1]

    const developmentfund = {
        uuid,
        titlecheck : req.body.titlecheck, 
        refid1: req.body.refid1, 
        refid2: req.body.refid2, 
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        grad: req.body.grad,
        round: req.body.round,
        acy: req.body.acy,
        datepay: req.body.datepay,
        timepay: req.body.timepay,
        amount: req.body.amount,
        img:img2,
        chance: req.body.chance,
        bank: req.body.bank,
        status
    };
    await pool.query('INSERT INTO admission_development_fund set ?',[developmentfund])
    res.status(200).json({
        success: true,
        data:developmentfund
    });
});

router.post('/foundation',upload.single('imgexam'),async(req, res)=>{
    var time = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
    const uuid = uuidv1(''+time+''+req.body.titlecheck);
    const status = "Pending";
    console.log(uuid);
    const img = req.file.path;
    const img2 = img.split("\\")[1]

    const foundation = {
        uuid,
        titlecheck : req.body.titlecheck, 
        refid1: req.body.refid1, 
        refid2: req.body.refid2, 
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        grad: req.body.grad,
        round: req.body.round,
        acy: req.body.acy,
        datepay: req.body.datepay,
        timepay: req.body.timepay,
        amount: req.body.amount,
        img:img2,
        chance: req.body.chance,
        bank: req.body.bank,
        status
    };
    await pool.query('INSERT INTO admission_foundation set ?',[foundation])
    res.status(200).json({
        success: true,
        data:foundation
    });
});

router.get('/dashbord/admission/exam',checkAuth,async(req,res)=>{
    const status = 'Pending';
    await pool.query('SELECT * FROM admission_examinationfee WHERE status = ?',[status])
    .then(result=>{
        // console.log(result)
        if(result.length < 1){
            return res.status(404).json({
                massage:'not have a Pending'
            });
        }else{
            return res.status(200).json({
                massage:'Sucessfuly',
                data: result
            });
        }
    })
    .catch(error=>{
        if(error){
            res.status(404).json({
                massage:error
            });
        }
    });
});

router.post('/dashbord/admission/exam',checkAuth,async(req,res)=>{
    const getuuid = req.body.uuid;
    const status = 'Approved';
    await pool.query('UPDATE admission_examinationfee set status = ? WHERE uuid = ?',[status, getuuid])
    .then(result=>{
        return res.status(200).json({
            massage:'Sucessfuly',
            data: result
        });
    })
    .catch(error=>{
        if(error){
            res.status(404).json({
                massage:error
            });
        }
    });
});



router.get('/dashbord/admission/tuitionfee',checkAuth,async(req,res)=>{
    const status = 'Pending';
    await pool.query('SELECT * FROM admission_tuition_fee WHERE status = ?',[status])
    .then(result=>{
        // console.log(result)
        if(result.length < 1){
            return res.status(404).json({
                massage:'not have a Pending'
            });
        }else{
            return res.status(200).json({
                massage:'Sucessfuly',
                data: result
            });
        }
    })
    .catch(error=>{
        if(error){
            res.status(404).json({
                massage:error
            });
        }
    });
});

router.post('/dashbord/admission/tuitionfee',checkAuth,async(req,res)=>{
    const getuuid = req.body.uuid;
    const status = 'Approved';
    await pool.query('UPDATE admission_tuition_fee set status = ? WHERE uuid = ?',[status, getuuid])
    .then(result=>{
        return res.status(200).json({
            massage:'Sucessfuly',
            data: result
        });
    })
    .catch(error=>{
        if(error){
            res.status(404).json({
                massage:error
            });
        }
    });
});


router.get('/dashbord/admission/development',checkAuth,async(req,res)=>{
    const status = 'Pending';
    await pool.query('SELECT * FROM admission_development_fund WHERE status = ?',[status])
    .then(result=>{
        // console.log(result)
        if(result.length < 1){
            return res.status(404).json({
                massage:'not have a Pending'
            });
        }else{
            return res.status(200).json({
                massage:'Sucessfuly',
                data: result
            });
        }
    })
    .catch(error=>{
        if(error){
            res.status(404).json({
                massage:error
            });
        }
    });
});


router.post('/dashbord/admission/development',checkAuth,async(req,res)=>{
    const getuuid = req.body.uuid;
    const status = 'Approved';
    await pool.query('UPDATE admission_development_fund set status = ? WHERE uuid = ?',[status, getuuid])
    .then(result=>{
        return res.status(200).json({
            massage:'Sucessfuly',
            data: result
        });
    })
    .catch(error=>{
        if(error){
            res.status(404).json({
                massage:error
            });
        }
    });
});




router.get('/dashbord/admission/foundation',checkAuth,async(req,res)=>{
    const status = 'Pending';
    await pool.query('SELECT * FROM admission_foundation WHERE status = ?',[status])
    .then(result=>{
        // console.log(result)
        if(result.length < 1){
            return res.status(404).json({
                massage:'not have a Pending'
            });
        }else{
            return res.status(200).json({
                massage:'Sucessfuly',
                data: result
            });
        }
    })
    .catch(error=>{
        if(error){
            res.status(404).json({
                massage:error
            });
        }
    });
});

router.post('/dashbord/admission/foundation',checkAuth,async(req,res)=>{
    const getuuid = req.body.uuid;
    const status = 'Approved';
    await pool.query('UPDATE admission_foundation set status = ? WHERE uuid = ?',[status, getuuid])
    .then(result=>{
        return res.status(200).json({
            massage:'Sucessfuly',
            data: result
        });
    })
    .catch(error=>{
        if(error){
            res.status(404).json({
                massage:error
            });
        }
    });
});



router.post('/dashbord/admission/approved',checkAuth,async(req,res)=>{
        const titlecheck = req.body.titlecheck;
        const grad = req.body.grad;
        const round = req.body.round;
        const acy = req.body.acy;
        const status = 'Approved';

    if(titlecheck ==='ค่าสมัครสอบ'){
    await pool.query('SELECT * FROM admission_examinationfee WHERE titlecheck = ? AND grad = ? AND round = ? AND  acy = ? AND status = ? ', [titlecheck,grad,round,acy,status])
    .then(result=>{
        return res.status(200).json({
            massage:'Sucessfuly',
            data: result
        });
    })
    .catch(error=>{
        if(error){
            res.status(404).json({
                massage:error
            });
        }
    });
    }
    if(titlecheck ==='ค่าเทอม'){
        await pool.query('SELECT * FROM admission_tuition_fee WHERE titlecheck = ? AND grad = ? AND round = ?  AND acy = ? AND status = ? ', [titlecheck,grad,round,acy,status])
        .then(result=>{
            return res.status(200).json({
                massage:'Sucessfuly',
                data: result
            });
        })
        .catch(error=>{
            if(error){
                res.status(404).json({
                    massage:error
                });
            }
        });
    }
    if(titlecheck ==='ค่ามูลนิธิ'){
        await pool.query('SELECT * FROM admission_development_fund WHERE titlecheck = ? AND grad = ? AND round = ?  AND acy = ? AND status = ? ', [titlecheck,grad,round,acy,status])
        .then(result=>{
            return res.status(200).json({
                massage:'Sucessfuly',
                data: result
            });
        })
        .catch(error=>{
            if(error){
                res.status(404).json({
                    massage:error
                });
            }
        });
    }
    if(titlecheck ==='ค่าเรียนปรับพื้นฐาน'){
        await pool.query('SELECT * FROM admission_foundation WHERE titlecheck = ? AND grad = ? AND round = ?  AND acy = ? AND status = ? ', [titlecheck,grad,round,acy,status])
        .then(result=>{
            return res.status(200).json({
                massage:'Sucessfuly',
                data: result
            });
        })
        .catch(error=>{
            if(error){
                res.status(404).json({
                    massage:error
                });
            }
        });
    }
});

module.exports = router;