const chai = require("chai")
const chaiHttp = require("chai-http")
const server = require("../server")

const should = chai.should()

chai.use(chaiHttp)

describe('Register user to test user routes', () => {

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
                done()

                /***************************
                * Test PUT route
                *****************************/

                describe("User routes test", () => {

                    it('should return a 200 code when user is updated', (done) => {

                        const mobileNumber = "08134127"

                        const user = {
                            firstName: "Emmanuel",
                            lastName: "Irabor",
                            email: "emmanuel.irabor7@gmail.com"
                        }

                        chai.request(server)
                            .put('/api/v1/user/' + mobileNumber)
                            .send(user)
                            .set('token', 'Bearer ' + token)
                            .end((err, response) => {
                                response.should.have.status(200)
                                response.should.be.a('object')
                                response.body.should.have.property('message').eq("User updated...")
                                done()
                            })
                    })

                    it('should return a 400 error when request is not given', (done) => {

                        const mobileNumber = "08134127"

                        chai.request(server)
                            .put('/api/v1/user/' + mobileNumber)
                            .send()
                            .set('token', 'Bearer ' + token)
                            .end((err, response) => {
                                response.should.have.status(400)
                                response.should.be.a('object')
                                response.body.should.have.property('message').eq("Error updating. Include firstName, lastName or email...")
                                done()
                            })
                    })
                })

                /***************************
                * Test DELETE route
                *
                ******************************/

                describe('DELETE user', () => {
                    it('should return a 400 error if email is not given', (done) => {

                        const mobileNumber = "08134127"

                        const user = {}

                        chai.request(server)
                            .delete('/api/v1/user/' + mobileNumber)
                            .send(user)
                            .set('token', 'Bearer ' + token)
                            .end((err, response) => {
                                response.should.have.status(400)
                                response.should.be.a('object')
                                done()
                            })
                    })
                })

                describe('DELETE user', () => {
                    it('should return 200 error if user is deleted', (done) => {

                        const mobileNumber = "08134127"

                        const user = {
                            email: "emmanuel.irabor7gmail.com"
                        }

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


            })
    })
})
