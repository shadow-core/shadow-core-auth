const chai = require('chai');
const chaiHttp = require('chai-http');
const chaiSubset = require('chai-subset');

const should = chai.should();
const { expect } = chai;

chai.use(chaiHttp);
chai.use(chaiSubset);

async function makeUserUnverified(models) {
  let user = await models.User.findByEmail('test2@test.com');
  user.isEmailVerified = false;
  user.registrationDate = Date.now() - 10 * 24 * 60 * 60 * 1000;
  await user.save();
}

async function makeUserVerified(models) {
  let user = await models.User.findByEmail('test2@test.com');
  user.isEmailVerified = true;
  await user.save();
}

export default function ExpressCoreAuthTestsUserToken(server, apiPrefix, models) {
  describe('User authorization endpoints', () => {
    describe('POST /auth/user/token', () => {
      it('should get an 401 status error without data', (done) => {
        let data = {};
        chai.request(server)
          .post(`${apiPrefix}/auth/user/token`)
          .send(data)
          .end((err, res) => {
            res.should.have.status(401);
            done();
          });
      });

      it('should get an 401 status error with wrong email/password', (done) => {
        let data = {
          'email': 'somegibberishemail@someotherlongstring.com',
          'password': 'someuknownpasswordverylongbutitdoesntexits',
        };
        chai.request(server)
          .post(`${apiPrefix}/auth/user/token`)
          .send(data)
          .end((err, res) => {
            res.should.have.status(401);
            done();
          });
      });

      it('should get an 401 status error with right email but wrong password', (done) => {
        let data = {
          'email': 'test2@test.com',
          'password': 'thisisverywrongpassword',
        };
        chai.request(server)
          .post(`${apiPrefix}/auth/user/token`)
          .send(data)
          .end((err, res) => {
            res.should.have.status(401);
            done();
          });
      });

      it('should authorize with correct email/password and get a token', (done) => {
        let data = {
          'email': 'test2@test.com',
          'password': 'test',
        };
        chai.request(server)
          .post(`${apiPrefix}/auth/user/token`)
          .send(data)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('token');
            done();
          });
      });
    });

    describe('POST /auth/user/token unverified', () => {
      before(async function() {
        await makeUserUnverified(models);
      });
      it('should get a 401 error with verification error message', (done) => {
        let data = {
          'email': 'test2@test.com',
          'password': 'test',
        };
        chai.request(server)
          .post(`${apiPrefix}/auth/user/token`)
          .send(data)
          .end((err, res) => {
            res.should.have.status(401);
            res.body.should.be.a('object');
            res.body.should.have.property('code').eq(4);
            res.body.should.have.property('success').eq(false);
            done();
          });
      });
    });

    describe('POST /auth/user/token verified', () => {
      before(async function() {
        await makeUserVerified(models);
      });
      it('should authenticate again', (done) => {
        let data = {
          'email': 'test2@test.com',
          'password': 'test',
        };
        chai.request(server)
          .post(`${apiPrefix}/auth/user/token`)
          .send(data)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('token');
            done();
          });
      });
    });
  });
}
