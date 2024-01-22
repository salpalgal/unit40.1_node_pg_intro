const express = require("express")
const router = express.Router()
const db = require("../db")

router.get("/",async function(req,res, next){
    try{
        const results = await db.query(`SELECT * FROM companies`)
        return res.json({companies:results.rows})
    }catch(err){
        return next(err)
    }
    
})
router.get("/:code", async function(req,res,next){
    try{
        const {code} = req.params
        const results = await db.query(`SELECT * FROM companies AS c INNER JOIN invoices AS i ON(c.code = i.comp_code) WHERE code =$1`, [code])
        console.log(results.rows)
        if(results.rows[0]){
            return res.json({company:results.rows[0]})
        }else{
            throw{message: "Not Found", status :404}
        }
    }catch(err){
        return next(err)
    }  
})
router.post("/", async function(req,res,next){
    try{
        const { code, name, description } = req.body;
        const results = await db.query(`INSERT INTO companies (code, name, description) VALUES($1, $2, $3) RETURNING *`,[code, name, description]);
        return res.status(201).json({company:results.rows[0]})
    }catch(err){
        return next(err)
    }
    
})
router.put("/:code", async function(req,res,next){
    try{
        const {code}= req.params
        const {name,description} = req.body
        const results = await db.query(`UPDATE companies SET name=$1, description=$2 WHERE code=$3 RETURNING *`,[name,description,code]);
        if(results.rows[0]){
            return res.json({company:results.rows[0]})
        }else{
            throw{message: "Not Found", status :404}
        }   
    }catch(err){
        return next(err)
    }   
})
router.delete("/:code", async function(req,res,next){
    try{
        const {code} = req.params;
        const results = await db.query(`DELETE FROM companies WHERE code=$1 RETURNING *`, [code])
        if(results.rows[0]){
            return res.json({message: "Deleted"})
        }else{
            throw{message:"Not Found", status: 404}
        }
    }catch(err){
        return next(err)
    }    
})

module.exports = router;