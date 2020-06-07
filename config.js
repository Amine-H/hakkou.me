'use strict';

module.exports = {
  url: 'https://hakkou.me',
  pathPrefix: '/',
  title: 'Amine Hakkou',
  subtitle: 'Blogging about software developpement, Java, Scala, Javascript, Typescript, Angular, React',
  copyright: '© All rights reserved.',
  disqusShortname: 'Amine-H',
  postsPerPage: 4,
  googleAnalyticsId: 'UA-109819575-1',
  useKatex: false,
  menu: [
    {
      label: 'Articles',
      path: '/'
    },
    {
      label: 'About me',
      path: '/pages/about'
    },
  ],
  author: {
    name: 'Amine Hakkou',
    photo: '/photo.jpg',
    bio: 'Software Engineer, FP lover, OSS believer',
    contacts: {
      email: 'hi@hakkou.me',
      twitter: 'amine_hakkou',
      github: 'Amine-H',
    }
  }
};
