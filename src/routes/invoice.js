const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const uuidv1 = require('uuid/v1');
const checkAuth = require('../middleware/check-auth');


router.post('/invoicemaster',checkAuth, async(req,res)=>{
    var time = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
    const uuid_invoice_master = uuidv1(''+time);
    const status = 'bill';
    const getinvoiceitem = req.body.item_invoice;
    const todbinvoiceitem = JSON.stringify(getinvoiceitem);
    const getdatainvoice ={
        uuid_invoice_master,
        subject:req.body.subject,
        description:req.body.description,
        date:req.body.date,
        due_date:req.body.due_date,
        taxid:req.body.taxid,
        acy:req.body.acy,
        item_invoice:todbinvoiceitem,
        totalitem:req.body.totalitem,
        status,
        create_by:req.body.create_by,
    };
    await pool.query('INSERT INTO invoice_master set ?',[getdatainvoice])
    .then(result=>{
        // console.log(result)
        if(result){
            return res.status(200).json({
                success: true,
                massage:'Sucessfuly',
            });
        }else{
            return res.status(200).json({
                success: false,
                massage:"บันทึกไม่สำเร็จจ้า",
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

router.post('/dashbord/myinvoice',checkAuth,async(req,res)=>{
    const getuuid = req.body.uuid;
    await pool.query('SELECT * FROM invoice_master WHERE create_by = ?',[getuuid])
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

router.post('/dashbord/getdetailinvoice',checkAuth,async(req,res)=>{
    const getuuid = req.body.uuid;
    await pool.query('SELECT * FROM invoice_master WHERE uuid_invoice_master = ?',[getuuid])
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


router.post('/dashbord/selectgendata',checkAuth,async(req,res)=>{
    const getgrade = req.body.grade;
    await pool.query('SELECT student_id,first_name,last_name,grade FROM student_kmids WHERE grade = ?',[getgrade])
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

router.post('/dashbord/genereateinvoice',checkAuth,async(req,res)=>{
    var time = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
    const getuuid_invoice_master = req.body.uuid_invoice_master;
    const subject = req.body.subject;
    const description = req.body.description;
    const getstudentlist = req.body.studentlist;
    const getacy = req.body.acy;
    const getamount = req.body.totalitem;
    const status = 'bill';
    const create_by = req.body.create_by;
    var countsuc = 0;
    const getinoviceno = 'last_invoiceno';
    const lastinvoiceno = await pool.query('SELECT * FROM temp WHERE tempitem = ?',[getinoviceno]);
    const tocallastinovice = lastinvoiceno[0].value;
    var numbercalinovice = parseInt(tocallastinovice,10);
    // console.log(numbercalinovice);
    var today = new Date();
    var yyyy = today.getFullYear();
    var mm = String(today.getMonth() + 1).padStart(2, '0');
    var year = yyyy+543;
    var yeartostring = year.toString();
    var strone = yeartostring[2]+""+yeartostring[3];
    // console.log(strone+""+mm);
    const tocallastinovice2 = strone+""+mm;

    for(let key of getstudentlist.data ){
        numbercalinovice += 1;
        var todbinoviceno = tocallastinovice2+""+numbercalinovice
        const uuid_invoice = uuidv1(time+''+key.student_id);
        var tostudentid = key.student_id;
        var tostudentname = key.first_name+" "+key.last_name;
        var tograde = key.grade;

        datatodb = {
            uuid_invoice_billed: uuid_invoice,
            uuid_invoice_master: getuuid_invoice_master,
            invoiceno: todbinoviceno,
            subject,
            description,
            studentid: tostudentid,
            studentname : tostudentname,
            grade: tograde,
            acy: getacy,
            amount: getamount,
            status,
            create_by
        }
        const response = await pool.query('INSERT INTO invoice_billed set ?',[datatodb]);
        if(response){
            countsuc += 1;
        }
        
    }
    if(countsuc === getstudentlist.data.length){
        // console.log(numbercalinovice);
        const updatelastinoviceno =  await pool.query('UPDATE temp set value = ? WHERE tempitem = ?',[numbercalinovice, getinoviceno]);
        if(updatelastinoviceno){
            return res.status(200).json({
                success: true,
                massage:'Sucessfuly',
            });
        }

    }else{
        return res.status(200).json({
            success: false,
            massage:'ไม่สำเร็จจ้าา',
        });
    }
});

router.post('/dashbord/getdetailgenereate',checkAuth,async(req,res)=>{
    const getuuid = req.body.uuid;
    await pool.query('SELECT * FROM invoice_billed WHERE uuid_invoice_master = ?',[getuuid])
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



router.post('/parent/inovoicelist',checkAuth,async(req,res)=>{
    const getstudentid = req.body.studentid;
    const status = 'bill';
    await pool.query('SELECT * FROM invoice_billed WHERE studentid = ? AND status = ?',[getstudentid,status])
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

router.post('/parent/detailbill',checkAuth,async(req,res)=>{
    const getuuid = req.body.uuid;
    await pool.query('SELECT * FROM invoice_billed WHERE uuid_invoice_billed  = ?',[getuuid])
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

router.post('/parent/downloadinvoice',checkAuth,async(req,res)=>{
    const getstudentid = req.body.studentid;
    await pool.query('SELECT * FROM ivpdfdownload WHERE student_id  = ?',[getstudentid])
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


router.post('/delinvioce',async(req,res)=>{
    const getuuidinvoice = req.body.uuid_invoice;
    const delinovicemaster = await pool.query('DELETE FROM invoice_master WHERE uuid_invoice_master = ? ',[getuuidinvoice]);
    const delinovicebillall = await pool.query('DELETE FROM invoice_billed WHERE uuid_invoice_master = ? ',[getuuidinvoice]);

    if(delinovicemaster && delinovicebillall){
        return res.status(200).json({
            success: true,
            massage:'Del invoice',
        });
    }else{
        return res.status(200).json({
            success: false,
            massage:'Del invoice not complate',
        });
    }
});




module.exports = router;