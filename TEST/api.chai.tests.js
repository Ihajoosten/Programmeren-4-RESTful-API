const chai = require('chai')
const chaiHttp = require('chai-http')
const jwt = require('jsonwebtoken')
const logger = require('../SRC/CONFIG/app.config').logger

// LET OP: voeg onder aan app.js toe: module.exports = app
const server = require('../index')

chai.should()
chai.use(chaiHttp)

const authorizationHeader = 'Authorization'
let token

//
// Deze functie wordt voorafgaand aan alle tests 1 x uitgevoerd.
//
before(() => {
  logger.trace('- before')
  // We hebben een token nodig om een ingelogde gebruiker te simuleren.
  // Hier kiezen we ervoor om een token voor UserId 1 te gebruiken.
  const payload = {
    UserId: 1
  }
  jwt.sign(
    {
      data: payload
    },
    'secretkey',
    {
      expiresIn: 2 * 60
    },
    (err, result) => {
      if (result) {
        token = result
      }
    }
  )
})

beforeEach(() => {
  logger.debug('- beforeEach')
})

/*  ==========================       
    =    POST METHOD TEST    =
    ==========================
*/

describe('User API POST to register a new user', () => {
  it('should return response status 200', done => {
    chai
      .request(server)
      .post('/api/register')
      .set('Content-Type', 'application/json')
      .send({
        firstName: 'Maria',
        lastName: 'Van Akker',
        streetAddress: 'Europalaan 12a',
        postalCode: '3829BR',
        city: 'Rotterdam',
        dateOfBirth: '1994-09-17',
        phoneNumber: '0697514820',
        emailAddress: '4vanAakkerMaaria12213@gmail.com',
        password: 'rotterdam'
      })
      .end((err, res, body) => {
        if (res) {
          res.should.have.status(200)

          res.body.should.be.an('object')
          res.body.should.have.property('firstName').that.is.a('string')
          res.body.should.have.property('lastName').that.is.a('string')
          res.body.should.have.property('streetAddress').that.is.a('string')
          res.body.should.have.property('postalCode').that.is.a('string')
          res.body.should.have.property('city').that.is.a('string')
          res.body.should.have.property('dateOfBirth').that.is.a('string')
          res.body.should.have
            .property('phoneNumber')
            .that.is.a('string')
            .equals('0697514820')
          res.body.should.have.property('emailAddress').that.is.a('string')
          res.body.should.have.property('password').that.is.a('string')
          res.body.should.not.have.property('education')

          done()
        }
      })
  })

  it('should return an error with code: 404', done => {
    chai
      .request(server)
      .post('/random')
      .set('Content-Type', 'application/json')
      .end((err, res) => {
        // Because the path is not right, the status should
        // return an error with status code 404
        res.should.have.status(404)
        done()
      })
  })
})

/*  ==========================       
    =    GET METHOD TEST     =
    ==========================
*/

describe('Apartment GET from the server by ID', () => {
  it('Returns an apartment by ID (GET - method)', done => {
    chai
      .request(server)
      .get('/api/apartments/1')
      .set(authorizationHeader, 'Bearer ' + token)
      .end((err, res) => {
        // The response status should be equal to 200

        res.should.have.status(200)

        const description = 'Woon huis Student'

        // the body should be equal to the posted object on place [1]
        res.body.description.should.equal(description)
        done()
      })
    done()
  })

  it('should return an error with message endpoint not found & code: 404', done => {
    chai
      .request(server)
      .get('/random')
      .end((err, res) => {
        // Because the path is not right, the status should
        // return an error with status code 404
        res.should.have.status(404)
        done()
      })
  })
})

describe('Apartments routes - GET all apartments', () => {
  it('should return all apartments', done => {
    chai
      .request(server)
      .get('/api/apartments/')
      .set(authorizationHeader, 'Bearer ' + token)
      .end((err, res) => {
        logger.trace(res.body.result)

        res.should.exist
        res.should.have.status(200)
        res.body.should.be.a('object')

        const result = res.body.result
        result.should.be.an('array')

        const apartment = result[0]
        user.should.have.property('ApartmentId').that.is.a('number')
        user.should.have.property('Description').that.is.a('string')
        user.should.have.property('StreetAddress').that.is.a('string')
        user.should.have.property('City').that.is.a('string')

        user.should.not.have.property('code')

        done()
      })
    done()
  })
})

/*  ==========================       
    =    DELETE METHOD TEST  =
    ==========================
*/
describe('Deletes a apartment from the server by ID', () => {
  it('Deletes a apartment by ID (PUT - method)', done => {
    chai
      .request(server)
      .delete('api/apartments/1')
      .end((err, res) => {
        res.status.should.equal(200).json('Movie with ID: ' + id + ' is deleted')
        chai
          .request(server)
          .get('api/apartments/1')
          .end((err, response) => {
            response.status(404)
            response.should.be.json
            response.body.should.not.have.property('title')
            response.body.should.not.have.property('description')
            response.body.should.not.have.property('releaseYear')
            response.body.should.not.have.property('director')
            done()
          })
      })
  })

  it('should return an error with code: 404', done => {
    chai
      .request(server)
      .delete('/random')
      .end((err, res) => {
        // Because the path is not right, the status should
        // return an error with status code 404
        res.status.should.equal(404)
        done()
      })
  })
})

/*  ====================================================       
    =   RESERVATION TESTS    =                         =
    ====================================================
*/

/*  ==========================       
    =    POST METHOD TEST    =
    ==========================
*/
describe('Add a reservation based on reservationID', () => {
  it('should return response status 200', done => {
    chai
      .request(server)
      .post('/api/apartments/1/reservations')
      .set('Content-Type', 'application/json')
      .send({
        id: 3,
        startDate : '2019-05-14',
        endDate : '2019-05-19',
        status : 'ACCEPTED'
      })
      .end((err, res, body) => {
        if (res) {
          res.should.have.status(200)

          res.body.should.be.an('object')
          res.body.should.have.property('id').that.is.a('number')
          res.body.should.have.property('startDate').that.is.a('string')
          res.body.should.have.property('endDate').that.is.a('string')
          res.body.should.have.property('status').that.is.a('string')
          res.body.should.not.have.property('UserId')

          done()
        }
      })
  })
})