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
        email: 'articles@gmail123.com',
        gender: 'male',
        password: 'article123.',
        jobRole: 'developer',
        department: 'education',
        isAdmin: false,
        address: 'No. 12 test road, Nigeria',
      })
      .end((err, res) => {
        if (err) {
          // console.log('first request error', err);
          done();
        }
        // console.log('second article response', res.body);
        chai.request(app)
          .post('/api/v1/auth/articles')
          .set('token', res.body.data.token)
          .set('Content-Type', 'application/json')
          .send({
            title: 'edit article test',
            article: 'edit article test',
          })
          .end((error, result) => {
            if (error) {
              // console.log('error in edit test here', error);
              done();
            }
            /* eslint no-unused-expressions: off */
            // console.log('second result passed to last', result.body);
            // console.log('token and articleid', res.body.data.token, result.body.data.articleId)
            // console.log(res.body.data.token);

            chai.request(app)
              .patch(`/api/v1/auth/articles/${result.body.data.articleId}`)
              .set('token', res.body.data.token)
              .set('Content-Type', 'application/json')
              .send({
                title: 'edited newly article',
                article: 'edited newly article',
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
                expect(ans.data).to.have.property('articleId');
                expect(ans.data).to.have.property('title');
                expect(ans.data).to.have.property('article');
                expect(ans.data).to.have.property('createdOn');
                expect(answer).to.have.status(200);
                done();
              });
          });
      });
  });
});
