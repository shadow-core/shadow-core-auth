const chai = require('chai');
const chaiHttp = require('chai-http');
const chaiSubset = require('chai-subset');

const should = chai.should();
const { expect } = chai;

chai.use(chaiHttp);
chai.use(chaiSubset);

async function makeUserUnverified(app) {
  const user = await app.models.User.findByEmail('test2@test.com');
  user.isEmailVerified = false;
  user.registrationDate -= (app.config.users.maxVerificationTime + 100);
  await user.save();
}

async function makeUserVerified(app) {
  const user = await app.models.User.findByEmail('test2@test.com');
  user.isEmailVerified = true;
  await user.save();
}

export default function UserToken(app, options = {}) {
  describe('User authorization endpoints', () => {
    describe('POST /auth/user/token', () => {
      it('should get an 401 status error without data', (done) => {
        const data = {};
        chai.request(app.server)
          .post(`${options.apiPrefix}/auth/user/token`)
          .send(data)
          .end((err, res) => {
            res.should.have.status(401);
            done();
          });
      });

      it('should get an 401 status error with wrong email/password', (done) => {
        const data = {
          email: 'somegibberishemail@someotherlongstring.com',
          password: 'someuknownpasswordverylongbutitdoesntexits',
        };
        chai.request(app.server)
          .post(`${options.apiPrefix}/auth/user/token`)
          .send(data)
          .end((err, res) => {
            res.should.have.status(401);
            done();
          });
      });

      it('should get an 401 status error with right email but wrong password', (done) => {
        const data = {
          email: 'test2@test.com',
          password: 'thisisverywrongpassword',
        };
        chai.request(app.server)
          .post(`${options.apiPrefix}/auth/user/token`)
          .send(data)
          .end((err, res) => {
            res.should.have.status(401);
            done();
          });
      });

      it('should authorize with correct email/password and get a token', (done) => {
        const data = {
          email: 'test2@test.com',
          password: 'test',
        };
        chai.request(app.server)
          .post(`${options.apiPrefix}/auth/user/token`)
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
        await makeUserUnverified(app);
      });
      it('should get a 401 error with verification error message', (done) => {
        const data = {
          email: 'test2@test.com',
          password: 'test',
        };
        chai.request(app.server)
          .post(`${options.apiPrefix}/auth/user/token`)
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
        await makeUserVerified(app);
      });
      it('should authenticate again', (done) => {
        const data = {
          email: 'test2@test.com',
          password: 'test',
        };
        chai.request(app.server)
          .post(`${options.apiPrefix}/auth/user/token`)
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
