const chai = require("chai")
const chaiHttp = require("chai-http")
const server = require("../server")

const should = chai.should()

chai.use(chaiHttp)

/**
 * TEST the /POST route
 */
describe('User registration', () => {

    it('should return a 400 error when email is absent ', (done) => {

        const user = {
            firstName: "Emmanuel",
            lastName: "Irabor",
            password: '123456',
        }

        chai.request(server)
            .post('/api/v1/auth/register')
            .send(user)
            .end((err, res) => {
                res.should.have.status(400)
                res.body.should.be.a('object')
                res.body.should.have.property('message')
                done()
            })
    })

    it('Should register a new user and create a wallet', (done) => {

        const user = {
            firstName: "Emmanuel",
            lastName: "Irabor",
            email: 'emmanuel.irabor7@gmail.com',
            password: '123456',
            mobileNumber: "08134127"
        }

        chai.request(server)
            .post('/api/v1/auth/register')
            .send(user)
            .end((err, res) => {
                res.should.have.status(201)
                res.body.should.be.a('object')
                res.body.should.have.property('message').eq("New user registered and wallet created")
                done()
            })
    })

    it('should return a 409 error if user with similar email already exists', (done) => {

        const user = {
            firstName: "Emmanuel",
            lastName: "Irabor",
            email: 'emmanuel.irabor7@gmail.com',
            password: '123456',
            mobileNumber: "08134127"
        }

        chai.request(server)
            .post('/api/v1/auth/register')
            .send(user)
            .end((err, res) => {
                res.should.have.status(409)
                res.body.should.be.a('object')
                res.body.should.have.property('message')
                done()
            })
    })
})


describe('User login', () => {

    it('should return a 400 error when email is not entered', (done) => {

        const user = { password: '123456' }

        chai.request(server)
            .post('/api/v1/auth/login')
            .send(user)
            .end((err, res) => {
                res.should.have.status(400)
                res.body.should.be.a('object')
                res.body.should.have.property('message')
                done()
            })
    })

    it('should return a 500 error when wrong email is entered', (done) => {

        const user = {
            email: 'michael@gmail.com',
            password: '123456'
        }

        chai.request(server)
            .post('/api/v1/auth/login')
            .send(user)
            .end((err, res) => {
                res.should.have.status(500)
                res.body.should.be.a('object')
                res.body.should.have.property('message')
                done()
            })
    })

    it('should return a 400 error when incorrect password is entered', (done) => {

        const user = {
            email: 'emmanuel.irabor7@gmail.com',
            password: '0000'
        }

        chai.request(server)
            .post('/api/v1/auth/login')
            .send(user)
            .end((err, res) => {
                res.should.have.status(401)
                res.body.should.be.a('object')
                res.body.should.have.property('message')
                done()
            })
    })

    it('Should login user', (done) => {

        const user = {
            email: 'emmanuel.irabor7@gmail.com',
            password: '123456'
        }

        chai.request(server)
            .post('/api/v1/auth/login')
            .send(user)
            .end((err, res) => {
                res.should.have.status(200)
                res.body.should.be.a('object')
                res.body.should.have.property('message')
                res.body.should.have.property('token')

                // get token from request body to test user routes
                const token = res.body.token


                describe('DELETE user', () => {
                    it('should delete user', (done) => {

                        const mobileNumber = "08134127"

                        chai.request(server)
                            .delete('/api/v1/user/' + mobileNumber)
                            .send(user)
                            .set('token', 'Bearer ' + token)
                            .end((err, response) => {
                                response.should.have.status(200)
                                response.should.be.a('object')

                                done()
                            })
                    })
                })
                done()
            })
    })
})
