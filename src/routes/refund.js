const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const uuidv1 = require('uuid/v1');
const checkAuth = require('../middleware/check-auth');
const multer = require('multer');


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


// router.post('/activity',upload.single('bookbank'),checkAuth, async(req,res)=>{
//     var time = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
//     const uuidrefund_activity = uuidv1(''+time);
//     const  status = 'Pending';
//     const img = req.file.path;
//     const img2 = img.split("\\")[1]
//     const getdatarefund ={
//          uuidrefund_activity,
//          uuid_activity_payment : req.body.uuidpayment,
//          text: req.body.text,
//          payitem:req.body.payitem,
//          studentid : req.body.studentid,
//          studentname: req.body.studentname,
//          parent_name: req.body.parentname,
//          grade: req.body.grade,
//          acy:req.body.acy,
//          amount: req.body.amount,
//          status,
//          bookbank:img2

//     };
//     await pool.query('INSERT INTO refund_activity set ?',[getdatarefund])
//     .then(result=>{
//         // console.log(result)
//         if(result){
//             return res.status(200).json({
//                 success: true,
//                 massage:'Sucessfuly',
//             });
//         }
//     })
//     .catch(error=>{
//         if(error){
//             res.status(404).json({
//                 massage:error
//             });
//         }
//     });

// });

router.post('/reqrefund',checkAuth, async(req,res)=>{
    var time = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
    const uuidrefund_activity = uuidv1(''+time);
    const status = 'Pending';
    const getdatarefund ={
         uuidrefund_activity,
         uuid_activity_payment : req.body.uuidpayment,
         reason1: req.body.reason1,
         reasons2: req.body.reasons2,
         payitem:req.body.payitem,
         studentid : req.body.studentid,
         studentname: req.body.studentname,
         parent_name: req.body.parentname,
         phone_number: req.body.phonenumber,
         email: req.body.email,
         bankname: req.body.bankname,
         branch:req.body.branch,
         account_no: req.body.account_no,
         account_name: req.body.account_name,
         grade: req.body.grade,
         acy:req.body.acy,
         amount: req.body.amount,
         status,

    };
    await pool.query('INSERT INTO refund_activity set ?',[getdatarefund])
    .then(result=>{
        // console.log(result)
        if(result){
            return res.status(200).json({
                success: true,
                massage:'Sucessfuly',
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

router.post('/parent/refundpayment',checkAuth,async(req,res)=>{
    const uuidpayment = req.body.uuid;
    const getupdateby = req.body.updateby;
    const status = 'request to refund';
    await pool.query('UPDATE any_activity_check set status = ?, update_by = ? WHERE uuid_any_activity_check = ? ',[status,getupdateby, uuidpayment])
    .then(result=>{
        return res.status(200).json({
            success: true,
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



router.post('/status',checkAuth,async(req,res)=>{
    const studentid = req.body.studentid;
    await pool.query('SELECT * FROM refund_activity WHERE studentid = ?',[studentid])
    .then(result=>{
        // console.log(result)
        if(result.length < 1){
            return res.status(201).json({
                success: false,
                massage:'not have a data'
            });
        }else{
            return res.status(200).json({
                success: true,
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


router.get('/dashbord/refund',checkAuth,async(req,res)=>{
    const status = 'Pending';
    await pool.query('SELECT * FROM refund_activity WHERE status = ?',[status])
    .then(result=>{
        // console.log(result)
        if(result.length < 1){
            return res.status(201).json({
                success: false,
                massage:'not have a Pending'
            });
        }else{
            return res.status(200).json({
                success: true,
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

router.post('/dashbord/refund',checkAuth,async(req,res)=>{
    const uuid = req.body.uuid;
    const getstudentid = req.body.studentid;
    const getupdateby = req.body.updateby;
    const status = 'Approved to refund';
    await pool.query('UPDATE refund_activity set status = ?, update_by = ? WHERE studentid = ? AND uuidrefund_activity = ? ',[status,getupdateby, getstudentid,uuid])
    .then(result=>{
        return res.status(200).json({
            success: true,
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

router.post('/parent/approvedrefundpayment',async(req,res)=>{
    const uuidpayment = req.body.uuid;
    const getupdateby = req.body.updateby;
    const status = 'Approved to refund';
    await pool.query('UPDATE any_activity_check set status = ?, update_by = ? WHERE uuid_any_activity_check = ?',[status,getupdateby, uuidpayment])
    .then(result=>{
        return res.status(200).json({
            success: true,
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


router.post('/dashbord/refund/approved',checkAuth, async(req,res)=>{
    const payitem = req.body.payitem;
    const grade =  req.body.grade;
    const acy = req.body.acy;
    const status = 'Approved to refund';
    await pool.query('SELECT * FROM refund_activity WHERE payitem = ? AND grade = ? AND  acy = ? AND status = ? ', [payitem,grade,acy,status])
    .then(result=>{
        return res.status(200).json({
            success: true,
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


router.post('/getdataparent',checkAuth, async(req, res)=>{
    const studentid = req.body.studentid;
    const parentname = req.body.parentname;
    await pool.query('SELECT * FROM student_kmids WHERE student_id = ?',[studentid])
    .then(result=>{
        if(result.length < 1 ){
            return res.status(202).json({
                success: false,
                message :"not have student ID"
            });
         }else{
            const fathers_name = result[0].fathers_frist_name+" "+result[0].fathers_last_name
             if(parentname === fathers_name){
                 const data = {
                     phone:result[0].phone_fathers,
                     email:result[0].email_fathers
                 };
                 return res.status(200).json({
                    success: true,
                    data: data,
                });
             }else{
                const data = {
                    phone:result[0].phone_mothers,
                    email:result[0].email_mothers
                };
                return res.status(200).json({
                   success: true,
                   data: data,
               });
             }
         }
    });
});


router.post('/dashbord/showdetail',checkAuth,async(req,res)=>{
    const uuid = req.body.uuid;
    await pool.query('SELECT * FROM refund_activity WHERE uuidrefund_activity = ?',[uuid])
    .then(result=>{
        // console.log(result)
        if(result.length < 1){
            return res.status(200).json({
                success: false,
                massage:'not have a data'
            });
        }else{
            return res.status(200).json({
                success: true,
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

router.post('/dashbord/refund/reject',checkAuth,async(req,res)=>{
    const uuidrefund = req.body.uuidrefund;
    const getcomment = req.body.comment;
    const getstudentid = req.body.studentid;
    const getupdateby = req.body.updateby;
    var time = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
    const uuidreject = uuidv1(''+time);
    const status = 'Reject to refund';

    const rejectform = {
        uuid_reject_refund:uuidreject,
        uuid_refund:uuidrefund,
        comment:getcomment,
        create_by:getupdateby
    };

    const toupdate = await pool.query('UPDATE refund_activity set status = ?, update_by = ? WHERE studentid = ? AND uuidrefund_activity = ? ',[status,getupdateby, getstudentid,uuidrefund]);
    const pushtodb = await pool.query('INSERT INTO reject_refund set ?',[rejectform]);

    if(toupdate&&pushtodb){
        return res.status(200).json({
            success: true,
            message :"บันทึกเรียบร้อยเรียบร้อยแล้ว",
         });
    }else{
        return res.status(200).json({
            success: false,
            message :"บันทึกเรียบร้อยไม่สำเร็จ",
         });
    }
});

router.post('/parent/rejectrefund',checkAuth, async(req,res)=>{
    const uuid = req.body.uuid;
    await pool.query('SELECT * FROM reject_refund WHERE uuid_refund = ?',[uuid])
    .then(result=>{
        // console.log(result)
        if(result.length < 1){
            return res.status(201).json({
                success: false,
                massage:'not have a data'
            });
        }else{
            return res.status(200).json({
                success: true,
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




module.exports = router;