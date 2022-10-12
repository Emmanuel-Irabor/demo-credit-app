const chai = require("chai")
const chaiHttp = require("chai-http")
const server = require("../server")

const should = chai.should()

chai.use(chaiHttp)

describe("Server test", () => {

    it('should return the index route ', (done) => {
        chai.request(server)
            .get('/')
            .end((err, res) => {
                res.should.have.status(200)
                res.body.should.be.a('object')
                res.body.should.have.property('message').eq("Welcome to Demo Credit!")
                done()
            })
    })
})
