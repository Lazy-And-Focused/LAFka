import { LAFka } from '@lafka/types';

const DefaultUser: LAFka.User = {
  id: '0',
  username: 'test_cool_userIUS',
  nickname: 'Mr Testy UsKra',
  avatar: '/post-cover.png',
  biography: "Hi! I'm tweek",
  blocked_posts: [],
  blog_posts: [],
  created_at: new Date(),
  followed_blog_posts: [],
  followed_forum_posts: [],
  followers: [],
  forum_posts: [],
  following: [],
  links: [],
  rights: {
    me: '',
    users: [],
  },
};

export default DefaultUser;
