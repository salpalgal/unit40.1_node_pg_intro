process.env.NODE_ENV = "test";

const request = require("supertest");

const app = require("../app")
let db = require("../db")


beforeEach(async function(){
    await db.query(`INSERT INTO companies (code, name, description) VALUES($1, $2, $3) RETURNING *`,['apple', 'Apple Computer', 'Maker of OSX.']);
    await db.query("INSERT INTO invoices (comp_code,amt) VALUES ($1,$2) RETURNING *",['apple', 100]);
});

afterEach(async function(){
    await db.query(`DELETE FROM companies`)
    await db.query(`DELETE FROM invoices`)
});
afterAll(async function(){
    db.end()
})

describe("GET /companies", function(){
    test("get all companies", async function(){
        const resp = await request(app).get("/companies");
        expect(resp.statusCode).toBe(200)
        expect(resp.body).toEqual({companies:[{"code":"apple","name":"Apple Computer","description":"Maker of OSX."}]})
    })
});
describe("GET /companies/:code", function(){
    test("get company in params", async function(){
        const resp = await request(app).get("/companies/apple");
        expect(resp.statusCode).toBe(200)

    })
})
describe("POST /companies", function(){
    test("post company", async function(){
        const resp = await request(app).post("/companies").send({"code":"samsung","name":"samsung phone","description":"maker of flip phone"});
        expect(resp.statusCode).toBe(201)
    })
})
describe("PUT /companies/:code", function(){
    test("update company in params", async function(){
        const resp = await request(app).put("/companies/apple").send({"name":"Apple","description":"Maker of ipad."})
        expect(resp.statusCode).toBe(200)
        expect(resp.body).toEqual({"company":{"code":"apple","name": "Apple", "description":"Maker of ipad."}})
    });
    test("test for error in params", async function(){
        const resp = await request(app).put("/companies/lg").send({"name":"Apple","description":"Maker of ipad."})
        expect(resp.statusCode).toBe(404)
    })
})
describe("DELETE /companies/:code", function(){
    test("delete company in params", async function(){
        const resp = await request(app).delete("/companies/apple")
        expect(resp.statusCode).toBe(200);
        expect(resp.body).toEqual({"message":"Deleted"})
    })
})
