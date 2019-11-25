// /* eslint linebreak-style: off */
// import chaiHttp from 'chai-http';
// import fs from 'fs';
// import path from 'path';
// import chai, { expect } from 'chai';

// import app from '../server';

// chai.use(chaiHttp);

// describe('POST /api/v1/auth/gifs', () => {
//   /* eslint no-undef: off */
//   it('should return all required fields', (done) => {
//     chai.request(app)
//       .post('/api/v1/auth/create-user')
//       .send({
//         firstName: 'postgifs',
//         lastName: 'postgifs',
//         email: 'gifs@gmail123.com',
//         gender: 'male',
//         password: 'test123456.',
//         jobRole: 'developer',
//         department: 'gifs',
//         isAdmin: false,
//         address: 'No. 12 test road, Nigeria',
//       })
//       .end((err, res) => {
//         if (err) {
//           done();
//         }
//         console.log('filepath', path.join(__dirname, './sample.jpg'));
//         chai.request(app)
//           .post('/api/v1/auth/gifs')
//           .set('token', res.body.data.token)
//           .set('Content-Type', 'application/x-www-form-urlencoded')
//           .field('title', 'postgifs')
//          .attach('image', fs.readFileSync(path.resolve(__dirname, './sample.jpg')), 'sample.jpg')
//           .end((error, result) => {
//             if (error) {
//               done();
//             }
//             /* eslint no-unused-expressions: off */
//             console.log('created successfully');

//             const ans = result.body;
//             expect(error).to.be.null;
//             expect(result).to.be.json;
//             expect(ans).to.have.property('status');
//             expect(ans).to.have.property('data');
//             expect(ans.data).to.have.property('gifId');
//             expect(ans.data).to.have.property('message');
//             expect(ans.data).to.have.property('createdOn');
//             expect(ans.data).to.have.property('title');
//             expect(ans.data).to.have.property('imageUrl');
//             expect(result).to.have.status(201);
//             done();
//           });
//       });
//   });
// });
