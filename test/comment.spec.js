/* eslint linebreak-style: off */
import chaiHttp from 'chai-http';
import chai, { expect } from 'chai';

import app from '../server';

chai.use(chaiHttp);

describe('POST /api/v1/auth/articles/:<articleId>/comment', () => {
  /* eslint no-undef: off */
  it('should return all required fields', (done) => {
    chai.request(app)
      .post('/api/v1/auth/create-user')
      .send({
        firstName: 'articles',
        lastName: 'articles',
        email: 'comment@gmail123.com',
        gender: 'male',
        password: 'comments123.',
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
            title: 'comments',
            article: 'comment body',
          })
          .end((error, result) => {
            if (error) {
              done();
            }
            /* eslint no-unused-expressions: off */

            chai.request(app)
              .post(`/api/v1/auth/articles/${result.body.data.articleId}/comment`)
              .set('token', res.body.data.token)
              .set('Content-Type', 'application/json')
              .send({
                comment: 'comment for the test',
              })
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
                expect(ans.data).to.have.property('comment');
                expect(ans.data).to.have.property('articleTitle');
                expect(ans.data).to.have.property('article');
                expect(ans.data).to.have.property('createdOn');
                expect(ans.data).to.have.property('commentDate');
                expect(ans.data).to.have.property('articleId');
                expect(answer).to.have.status(200);
                done();
              });
          });
      });
  });
});
