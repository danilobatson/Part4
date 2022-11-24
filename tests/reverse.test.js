const reverse = require('../utils/for_testing').reverse;
const average = require('../utils/for_testing').average;
const listHelper = require('../utils/list_helper');

describe('dummy', () => {
  test('dummy returns one', () => {
    const blogs = [];
    const result = listHelper.dummy(blogs);
    expect(result).toBe(1);
  });
});
describe('totalLikes', () => {
  test('sum of all likes', () => {
    const blogs = [
      {
        _id: '5a422a851b54a676234d17f7',
        title: 'React patterns',
        author: 'Michael Chan',
        url: 'https://reactpatterns.com/',
        likes: 7,
        __v: 0,
      },
    ];

    const result = listHelper.totalLikes(blogs);
    expect(result).toBe(7);
  });
  test('sum of all likes', () => {
    const blogs = [
      {
        _id: '5a422a851b54a676234d17f7',
        title: 'React patterns',
        author: 'Michael Chan',
        url: 'https://reactpatterns.com/',
        likes: 0,
        __v: 0,
      },
      {
        _id: '5a422a851b54a676234d17f7',
        title: 'React patterns',
        author: 'Michael Chan',
        url: 'https://reactpatterns.com/',
        likes: 7,
        __v: 0,
      },
      {
        _id: '5a422a851b54a676234d17f7',
        title: 'React patterns',
        author: 'Michael Chan',
        url: 'https://reactpatterns.com/',
        likes: 7,
        __v: 0,
      },
      {
        _id: '5a422a851b54a676234d17f7',
        title: 'React patterns',
        author: 'Michael Chan',
        url: 'https://reactpatterns.com/',
        likes: 7,
        __v: 0,
      },
    ];

    const result = listHelper.totalLikes(blogs);
    expect(result).toBe(21);
  });
});

describe('favoriteBlog', () => {
  test('return blog with most likes', () => {
    const blogs = [
      {
        title: 'Canonical string reduction',
        author: 'Edsger W. Dijkstra',
        likes: 12,
      },
      {
        title: 'Canonical string reduction',
        author: 'Michael Chan',
        likes: 9,
      },
      {
        title: 'Canonical string reduction',
        author: 'Mark Twain',
        likes: 20,
      },
    ];

    const result = listHelper.favoriteBlog(blogs);
    expect(result).toEqual(blogs[2]);
  });
});

describe('mostLikes', () => {
  test('return blog with most likes', () => {
    const blogs = [
      {
        author: 'Edsger W. Dijkstra',
        likes: 12,
      },
      {
        author: 'Michael Chan',
        likes: 9,
      },
      {
        author: 'Mark Twain',
        likes: 20,
      },
    ];

    const result = listHelper.mostLikes(blogs);
    expect(result).toEqual(blogs[2]);
  });
});
describe('mostBlogs', () => {
  test('return blog with most blogs', () => {
    const blogs = [
      {
        author: 'Edsger W. Dijkstra',
        blogs: 12,
      },
      {
        author: 'Michael Chan',
        blogs: 9,
      },
      {
        author: 'Mark Twain',
        blogs: 20,
      },
    ];

    const result = listHelper.mostBlogs(blogs);
    expect(result).toEqual(blogs[2]);
  });
});

test('reverse of a', () => {
  const result = reverse('a');

  expect(result).toBe('a');
});

test('reverse of react', () => {
  const result = reverse('react');

  expect(result).toBe('tcaer');
});

test('reverse of releveler', () => {
  const result = reverse('releveler');

  expect(result).toBe('releveler');
});

describe('average', () => {
  test('of one value is the value itself', () => {
    expect(average([1])).toBe(1);
  });

  test('of many is calculated right', () => {
    expect(average([1, 2, 3, 4, 5, 6])).toBe(3.5);
  });

  test('of empty array is zero', () => {
    expect(average([])).toBe(0);
  });
});
