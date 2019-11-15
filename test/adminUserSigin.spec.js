import chaiHttp from 'chai-http';
import chai, { expect } from 'chai';

import app from '../server';

chai.use(chaiHttp);

describe('POST /api/v1/auth/signin', () => {
  before((done) => {
    chai.request(app)
      .post('/api/v1/auth/create-user')
      .send({
        firstName: 'test',
        lastName: 'test',
        email: 'test@gmail1.com',
        gender: 'male',
        password: 'test1234.',
        jobRole: 'developer',
        department: 'education',
        isAdmin: false,
        address: 'No. 12 test road, Nigeria',
      })
      .end((err, res) => {
        if (err) {
          done();
        } else if (res) {
          done();
        }
      });
  });
  /* eslint no-undef: off */
  it('should return userId and token', (done) => {
    chai.request(app)
      .post('/api/v1/auth/signin')
      .send({
        email: 'test@gmail1.com',
        password: 'test1234.',
      })
      .end((err, res) => {
        if (err) {
          done();
        }
        expect(err).to.be.null; /* eslint no-unused-expressions: off */
        expect(res).to.be.json;
        expect(res.body).to.have.property('status');
        expect(res.body.data).to.have.property('userId');
        expect(res.body.data).to.have.property('token');
        expect(res).to.have.status(200);
        done();
      });
  });

  it('should not allow wrong email or password', (done) => {
    chai.request(app)
      .post('/api/v1/auth/signin')
      .send({
        email: 'test@gmail.com',
        password: 'test2345.',
      })
      .end((err, res) => {
        if (err) done();
        expect(err).to.be.null; /* eslint no-unused-expressions: off */
        expect(res).to.be.json;
        expect(res.body).to.have.property('status');
        expect(res.body).to.have.property('error');
        expect(res).to.have.status(401);
        done();
      });
  });
});
