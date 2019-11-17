/* eslint linebreak-style: off */
import chaiHttp from 'chai-http';
import chai, { expect } from 'chai';

import app from '../server';

chai.use(chaiHttp);

describe('POST /api/v1/auth/articles', () => {
  /* eslint no-undef: off */
  it('should return all required fields', (done) => {
    chai.request(app)
      .post('/api/v1/auth/create-user')
      .send({
        firstName: 'articles',
        lastName: 'articles',
        email: 'test@gmail123.com',
        gender: 'male',
        password: 'test123456.',
        jobRole: 'developer',
        department: 'education',
        isAdmin: false,
        address: 'No. 12 test road, Nigeria',
      })
      .end((err, res) => {
        if (err) {
          // console.log(err);
          done();
        }
        chai.request(app)
          .post('/api/v1/auth/articles')
          .set('token', res.body.data.token)
          .set('Content-Type', 'application/json')
          .send({
            title: 'article test',
            article: 'article test',
          })
          .end((error, result) => {
            if (error) {
              // console.log(error);
              done();
            }
            /* eslint no-unused-expressions: off */
            // console.log('articles ', result.body);

            const ans = result.body;
            expect(error).to.be.null;
            expect(result).to.be.json;
            expect(ans).to.have.property('status');
            expect(ans).to.have.property('data');
            expect(ans.data).to.have.property('message');
            expect(ans.data).to.have.property('articleId');
            expect(ans.data).to.have.property('title');
            expect(ans.data).to.have.property('article');
            expect(ans.data).to.have.property('createdOn');
            expect(result).to.have.status(201);
            done();
          });
      });
  });
});
