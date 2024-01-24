const express = require("express")
const router = express.Router()
const db = require("../db")
const moment = require("moment")

router.get("/", async function(Req,res,next){
    const results = await db.query('SELECT * FROM invoices')
    return res.json({invoices:results.rows})
});

router.get("/:id", async function(req,res,next){
    try{
        const id = req.params.id
        const results = await db.query("SELECT * FROM invoices AS i INNER JOIN companies AS c ON (i.comp_code = c.code) WHERE id=$1",[id])
        if(results.rows[0]){
            return res.json({invoice:results.rows[0]})
        }else{
            throw{message:"not found", status:404}
        }
    }catch(err){
        return next(err)
    }   
})
router.post("/", async function(req,res,next){
    try{
        const {comp_code,amt} = req.body
        const results = await db.query("INSERT INTO invoices (comp_code,amt) VALUES ($1,$2) RETURNING *",[comp_code, amt]);
        return res.status(201).json({invoice: results.rows[0]})
    }catch(err){
        return next(err)
    }
   
})
router.put('/:id', async function(req,res,next){
    try{
        let date = moment().format("YYYY-MM-DD")
       
        let results;
        const {id} = req.params
        const {amt, paid} = req.body
        if(paid === true){
            paid_date = date
            results = await db.query("UPDATE invoices SET amt=$1, paid_date=$2, paid=$3 WHERE id=$4 RETURNING *",[amt, paid_date ,paid, id]);
        }
        if(paid === false){
            paid_date = null
            results = await db.query("UPDATE invoices SET amt=$1, paid_date=$2, paid=$3 WHERE id=$4 RETURNING *",[amt, paid_date ,paid, id]);
        }if(!paid){
            results = await db.query("UPDATE invoices SET amt=$1  WHERE id=$2 RETURNING *",[amt,id]);
        }
        
        if(results.rows[0]){
            return res.json({invoice:results.rows[0]})
        }else{
            throw{message:"not found",status:404}
        }    
    }catch(err){
        return next(err)
    }
})
router.delete("/:id", async function(req,res,next){
    try{
        const {id} = req.params
        const results = await db.query("DELETE FROM invoices WHERE id=$1 RETURNING *",[id]);
        if(results.rows[0]){
            return res.json({message: "deleted"})
        }else{
            throw {message:"not found", status:404}
        }
    }catch(err){
        return next(err)
    }
  
})

module.exports = router;