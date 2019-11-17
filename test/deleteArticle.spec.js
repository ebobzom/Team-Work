/* eslint linebreak-style: off */
import chaiHttp from 'chai-http';
import chai, { expect } from 'chai';

import app from '../server';

chai.use(chaiHttp);

describe('POST /api/v1/auth/articles/:<articleId>', () => {
  /* eslint no-undef: off */
  it('should return all required fields', (done) => {
    chai.request(app)
      .post('/api/v1/auth/create-user')
      .send({
        firstName: 'articles',
        lastName: 'articles',
        email: 'articles@gmail1234567.com',
        gender: 'male',
        password: 'article123.',
        jobRole: 'developer',
        department: 'education',
        isAdmin: false,
        address: 'No. 12 test road, Nigeria',
      })
      .end((err, res) => {
        if (err) {
          done();
        }
        chai.request(app)
          .post('/api/v1/auth/articles')
          .set('token', res.body.data.token)
          .set('Content-Type', 'application/json')
          .send({
            title: 'delete article test',
            article: 'edit delete route article test',
          })
          .end((error, result) => {
            if (error) {
              done();
            }
            /* eslint no-unused-expressions: off */
            chai.request(app)
              .delete(`/api/v1/auth/articles/${result.body.data.articleId}`)
              .set('token', res.body.data.token)
              .end((error2, answer) => {
                if (error2) {
                  done();
                }
                const ans = answer.body;
                expect(error2).to.be.null;
                expect(answer).to.be.json;
                expect(ans).to.have.property('status');
                expect(ans).to.have.property('data');
                expect(ans.data).to.have.property('message');
                expect(answer).to.have.status(200);
                done();
              });
          });
      });
  });
});
