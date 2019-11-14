import chaiHttp from 'chai-http';
import chai, { expect } from 'chai';

import app from '../server';

chai.use(chaiHttp);

describe('POST /api/v1/auth/create-user', () => { /* eslint no-undef: off */
  it('should return all required fields with a token included', (done) => {
    chai.request(app)
      .post('/api/v1/auth/create-user')
      .send({
        firstName: 'test',
        lastName: 'test',
        email: 'test@gmail.com',
        gender: 'male',
        password: 'test123.',
        jobRole: 'developer',
        department: 'education',
        isAdmin: false,
        address: 'No. 12 test road, Nigeria',
      })
      .end((err, res) => {
        if (err) done();
        expect(err).to.be.null; /* eslint no-unused-expressions: off */
        expect(res).to.be.json;
        expect(res.body).to.have.property('status');
        expect(res.body).to.have.property('data');
        expect(res.body.data).to.have.property('userId');
        expect(res.body.data).to.have.property('message');
        expect(res.body.data).to.have.property('token');
        expect(res.body.data).property('jobRole');
        expect(res.body.data).to.have.property('gender');
        expect(res.body.data).to.have.property('email');
        expect(res.body.data).to.have.property('department');
        expect(res).to.have.status(201);
        done();
      });
  });

  it('should not allow duplicate users', (done) => {
    chai.request(app)
      .post('/api/v1/auth/create-user')
      .send({
        firstName: 'test',
        lastName: 'test',
        email: 'test@gmail.com',
        gender: 'male',
        password: 'test123.',
        jobRole: 'developer',
        department: 'education',
        isAdmin: false,
        address: 'No. 12 test road, Nigeria',
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

  it('should allow only the right data type', (done) => {
    chai.request(app)
      .post('/api/v1/auth/create-user')
      .send({
        firstName: 123,
        lastName: 1234,
        email: 'test@gmail.com',
        gender: 'male',
        password: 'test123.',
        jobRole: 'developer',
        department: 'education',
        isAdmin: 12345,
        address: 'No. 12 test road, Nigeria',
      })
      .end((err, res) => {
        if (err) done();
        expect(err).to.be.null; /* eslint no-unused-expressions: off */
        expect(res).to.be.json;
        expect(res.body).to.have.property('status');
        expect(res.body).to.have.property('error');
        expect(res).to.have.status(422);
        done();
      });
  });
});
