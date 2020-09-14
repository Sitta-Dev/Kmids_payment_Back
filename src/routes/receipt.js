const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const uuidv1 = require('uuid/v1');
const checkAuth = require('../middleware/check-auth');


router.post('/parent/receipt',checkAuth,async(req,res)=>{
    const uuidreceipt  = req.body.uuids
    await pool.query('SELECT * FROM any_activity_check WHERE uuid_any_activity_check = ?',[uuidreceipt])
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

router.post('/parent/rejectpayment',checkAuth, async(req,res)=>{
    const uuid = req.body.uuid;
    await pool.query('SELECT * FROM reject_payment WHERE uuid_payment = ?',[uuid])
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