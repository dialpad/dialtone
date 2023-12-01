/* eslint-disable max-len */
export default {
  items ({ query }) {
    const CONTACT_LIST = [
      {
        id: '1',
        name: 'Test',
        avatarSrc: 'https://avatars.githubusercontent.com/u/13851061?s=460&u=1f1b5b0b5b2b2b2b2b2b2b2b2b2b2b2b2b2b2b&v=4',
      },
      {
        id: '2',
        name: 'Test2',
        avatarSrc: 'https://avatars.githubusercontent.com/u/13851061?s=460&u=1f1b5b0b5b2b2b2b2b2b2b2b2b2b2b2b2b2b2b&v=4',
      },
      {
        id: '3',
        name: 'Test3',
        avatarSrc: 'https://avatars.githubusercontent.com/u/13851061?s=460&u=1f1b5b0b5b2b2b2b2b2b2b2b2b2b2b2b2b2b2b&v=4',
      },
    ];

    if (query.length === 0) return CONTACT_LIST;

    return CONTACT_LIST.filter((contact) => { return contact.name.toLowerCase().startsWith(query.toLowerCase()); });
  },
};
