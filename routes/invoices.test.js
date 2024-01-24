process.env.NODE_ENV = "test";

const request = require("supertest");

const app = require("../app")
let db = require("../db");


beforeEach(async function(){
    let companies = db.query(`INSERT INTO companies (code, name, description) VALUES($1, $2, $3) RETURNING *`,['apple', 'Apple Computer', 'Maker of OSX.']);
    let invoices =  db.query("INSERT INTO invoices (comp_code,amt) VALUES ($1,$2) RETURNING *",['apple', 100]);
     await Promise.all([invoices,companies])
});

afterEach(async function(){
    await db.query(`DELETE FROM companies`)
    await db.query(`DELETE FROM invoices`)
});
afterAll(async function(){
    db.end()
})

describe("GET /invoices", function(){
    test("get all invoices", async function(){
        const resp = await request(app).get("/invoices")
        expect(resp.statusCode).toBe(200)
    })
})
describe("POST /invoices", function(){
    test("post invoice", async function(){
        const resp = await request(app).post("/invoices").send({"comp_code":"apple", "amt": 300})
        expect(resp.statusCode).toBe(201)
    })
})
describe("PUT /invoices/:id", function(){
    test("update invoice with id in params", async function(){
        const resp = await request(app).put("/invoices/1").send({"comp_code": "Apple","amt":250})
        expect(resp.statusCode).toBe(200)
    })
})
describe("DELETE /invoices/:id", function(){
    test("delete invoice wiht id in params", async function(){
        const resp = await request(app).delete("/invoices/1")
        expect(resp.statusCode).toBe(200)
    })
})