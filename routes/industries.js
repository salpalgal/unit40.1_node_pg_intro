const express = require("express")
const router = express.Router()
const db = require("../db")
const slugify = require("slugify")

router.get("/", async function(req,res,next){
    let r = {"code":"test","inudstry":"sample","company_code":"ex"}
    let compArr =[]
    let code;
    let industry;
    let indObj ={}
    let finalArr=[]
    const results = await db.query(`SELECT id.code, id.industry,ic.company_code FROM industries AS id LEFT JOIN industries_companies AS ic ON id.code = ic.industry_code `);
    // const results = await db.query(`SELECT * FROM industries`)
    for(let result of results.rows){
        // console.log(result)
        if(!(result.code in indObj)){
            indObj[result.code] = [result]
        }else{
            indObj[result.code].push(result)
        }
    }
    for(let ind in indObj){
        let {code, industry} = indObj[ind][0]
        console.log(code)
        let company_code = indObj[ind].map(c=>c.company_code)
        let obj = {code,industry,company_code}
        finalArr.push(obj)
    }
    return res.json({industries:finalArr})
    // console.log(results)
    // return res.json({industries:results.rows})
})
router.post("/", async function(req,res,next){
    try{
        const {code,industry} = req.body;
        const results = await db.query(`INSERT INTO industries(code,industry) VALUES($1,$2)RETURNING *`,[code,industry]);
        return res.status(201).json({industry:results.rows[0]})
    }catch(err){
        return next(err)
    }
  
})

module.exports = router;