/* eslint-disable max-len */
const CONTACT_LIST = [
  {
    id: 'test.person',
    name: 'Test Person',
    avatarSrc: 'https://avatars.githubusercontent.com/u/13851061?s=460&u=1f1b5b0b5b2b2b2b2b2b2b2b2b2b2b2b2b2b2b&v=4',
  },
  {
    id: 'test.person2',
    name: 'Test Person 2',
    avatarSrc: 'https://avatars.githubusercontent.com/u/13851061?s=460&u=1f1b5b0b5b2b2b2b2b2b2b2b2b2b2b2b2b2b2b&v=4',
  },
  {
    id: 'test.person3',
    name: 'Test Person 3',
    avatarSrc: 'https://avatars.githubusercontent.com/u/13851061?s=460&u=1f1b5b0b5b2b2b2b2b2b2b2b2b2b2b2b2b2b2b&v=4',
  },
  {
    id: 'brad.paugh',
    name: 'Brad Paugh',
    avatarSrc: 'https://avatars.githubusercontent.com/u/13851061?s=460&u=1f1b5b0b5b2b2b2b2b2b2b2b2b2b2b2b2b2b2b&v=4',
  },
  {
    id: 'bradley.hawkins',
    name: 'Bradley Hawkins',
    avatarSrc: 'https://avatars.githubusercontent.com/u/13851061?s=460&u=1f1b5b0b5b2b2b2b2b2b2b2b2b2b2b2b2b2b2b&v=4',
  },
  {
    id: 'julio.ortega',
    name: 'Tico Ortega',
    avatarSrc: 'https://avatars.githubusercontent.com/u/13851061?s=460&u=1f1b5b0b5b2b2b2b2b2b2b2b2b2b2b2b2b2b2b&v=4',
  },
  {
    id: 'ignacio.Ropolo',
    name: 'Ignacio Ropolo',
    avatarSrc: 'https://avatars.githubusercontent.com/u/13851061?s=460&u=1f1b5b0b5b2b2b2b2b2b2b2b2b2b2b2b2b2b2b&v=4',
  },
  {
    id: 'nina.repetto',
    name: 'Nina Repetto',
    avatarSrc: 'https://avatars.githubusercontent.com/u/13851061?s=460&u=1f1b5b0b5b2b2b2b2b2b2b2b2b2b2b2b2b2b2b&v=4',
  },
];

export default {
  async items ({ query }) {
    // simulate an API call by waiting 1000 seconds.
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (query.length === 0) return CONTACT_LIST;
    return CONTACT_LIST.filter((contact) => { return contact.name.toLowerCase().startsWith(query.toLowerCase()); });
  },
};
