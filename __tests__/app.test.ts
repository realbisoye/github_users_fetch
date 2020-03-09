/* eslint-disable global-require */
import request from 'supertest';
import app from '../src/app';
import { searchQuery } from '../src/query/search';
import { userDataQuery } from '../src/query/user';

jest.mock('node-fetch', () => require('fetch-mock').sandbox());

const fetchMock = require('node-fetch');

describe('App Test', () => {
  beforeEach(() => {
    fetchMock.resetHistory();
  });

  afterAll(() => {
    fetchMock.reset();
  });

  it('GET /random-url should return 404', (done) => {
    request(app).get('/reset')
      .expect(404, done);
  });

  it('GET /search should return 200', (done) => {
    fetchMock.once((url: string, options: any) => options.body.includes('search'), {
      status: 200,
      data: {
        search: {
          nodes: [{
            languages: {
              nodes: [{
                name: 'Javascript',
              }, {
                name: 'Typescript',
              }],
            },
          }],
        },
      },
    })
      .once((url: string, options: any) => options.body.includes('user'), {
        status: 200,
        data: {
          user: {
            login: 'naruto',
            name: 'Naruto Nakamura',
            avatarUrl: 'https://googleusercontent.com/rodfjdjs',
            followers: { totalCount: 20 },
          },
        },
      });

    request(app)
      .get('/search?username=johndoe&language=javascript')
      .expect(200, done);
  });

  it('GET /search should use fallback if language response is empty', (done) => {
    fetchMock.once((url: string, options: any) => options.body.includes('javascript'), {
      status: 200,
      data: {
        search: {
          nodes: [],
        },
      },
    })
      .once((url: string, options: any) => options.body.includes('typescript'), {
        status: 200,
        data: {
          search: {
            nodes: [{
              languages: {
                nodes: [{
                  name: 'Javascript',
                }, {
                  name: 'Typescript',
                }],
              },
            }],
          },
        },
      })
      .once((url: string, options: any) => options.body.includes('user'), {
        status: 200,
        data: {
          user: {
            login: 'naruto',
            name: 'Naruto Nakamura',
            avatarUrl: 'https://googleusercontent.com/rodfjdjs',
            followers: { totalCount: 20 },
          },
        },
      });

    request(app)
      .get('/search?username=johndoe&language=javascript,typescript')
      .expect(200, done);
  });

  it('GET /search should return 400 if no username query is provided', (done) => {
    request(app)
      .get('/search?language=javascript')
      .expect(400, done);
  });

  it('GET /search should return 400 if no language query is provided', (done) => {
    request(app)
      .get('/search?username=johndoe')
      .expect(400, done);
  });
});
