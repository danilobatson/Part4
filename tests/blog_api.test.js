const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const _ = require('lodash/core');
const helper = require('./test_helper');
const api = supertest(app);
const bcrypt = require('bcrypt');

const Blog = require('../models/blogs');
const User = require('../models/users');

beforeAll(() => jest.setTimeout(10000));

beforeEach(async () => {
  await Blog.deleteMany({});

  for (let blog of helper.initialBlogs) {
    let blogObject = new Blog(blog);
    await blogObject.save();
  }
});

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/);
}, 100000);

test('there are two blogs', async () => {
  const response = await api.get('/api/blogs');
  expect(response.body).toHaveLength(2);
  expect(response.body).toHaveLength(helper.initialBlogs.length);
});

test('blogs have an id key', async () => {
  const response = await api.get('/api/blogs');
  const res = _.filter(response.body, (blog) => {
    return blog.id.length > 0;
  });
  expect(res).toHaveLength(2);
});

test('the first blog is about react', async () => {
  const response = await api.get('/api/blogs');

  const str = 'reactpatterns';

  const res = _.filter(response.body, (blog) => blog.url.includes(str));
  expect(res).toBeTruthy();
});

test('a valid blog can be added', async () => {
  const newBlog = {
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12,
  };

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/);

  const response = await helper.blogsInDb();

  const titles = response.map((r) => r.title);

  expect(response).toHaveLength(helper.initialBlogs.length + 1);
  expect(titles).toContain('Canonical string reduction');
});

test('blog without content is not added', async () => {
  const newBlog = {};

  await api.post('/api/blogs').send(newBlog).expect(400);

  const response = await helper.blogsInDb();

  expect(response).toHaveLength(helper.initialBlogs.length);
});

test('blog without title is not added', async () => {
  const newBlog = {
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12,
  };

  await api.post('/api/blogs').send(newBlog).expect(400);

  const response = await helper.blogsInDb();

  expect(response).toHaveLength(helper.initialBlogs.length);
});
test('blog without url is not added', async () => {
  const newBlog = {
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    likes: 12,
  };

  await api.post('/api/blogs').send(newBlog).expect(400);

  const response = await helper.blogsInDb();

  expect(response).toHaveLength(helper.initialBlogs.length);
});

test('blog without likes is 0', async () => {
  const newBlog = {
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
  };

  await api.post('/api/blogs').send(newBlog).expect(201);

  const response = await helper.blogsInDb();
  const res = _.find(response, (blog) => blog.likes === 0);

  expect(res.likes).toEqual(0);
});

test('a blog can be deleted', async () => {
  const blogsAtStart = await helper.blogsInDb();
  const blogToDelete = blogsAtStart[0];

  await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204);

  const blogsAtEnd = await helper.blogsInDb();

  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length - 1);

  const id = blogsAtEnd.map((r) => r.id);

  expect(id).not.toContain(blogToDelete.id);
});

describe('when there is initially one user at db', () => {
  beforeEach(async () => {
    await User.deleteMany({});

    const passwordHash = await bcrypt.hash('sekret', 10);
    const user = new User({ username: 'root', passwordHash });

    await user.save();
  });

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'salainen',
    };

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1);

    const usernames = usersAtEnd.map((u) => u.username);
    expect(usernames).toContain(newUser.username);
  });

  test('creation fails with proper statuscode and message if username already taken', async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'salainen',
    };

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    expect(result.body.error).toContain('username must be unique');

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toHaveLength(usersAtStart.length);
  });
});

afterAll(() => {
  mongoose.connection.close();
}, 100000);
