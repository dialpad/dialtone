import defaultImage from '@/common/assets/avatar2.png';

/* eslint-disable max-len */
const CONTACT_LIST = [
  {
    id: 'test.person',
    name: 'Test Person',
    avatarSrc: defaultImage,
    showDetails: true,
    presence: 'active',
    presenceText: '',
    status: 'This is a test status',
  },
  {
    id: 'test.person2',
    name: 'Test Person 2',
    avatarSrc: defaultImage,
    showDetails: true,
    presence: 'busy',
    presenceText: 'DND',
    status: 'This is a test status',
  },
  {
    id: 'test.person3',
    name: 'Test Person 3',
    avatarSrc: defaultImage,
    showDetails: true,
    presence: 'busy',
    presenceText: 'DND',
    status: '',
  },
  {
    id: 'brad.paugh',
    name: 'Brad Paugh',
    avatarSrc: defaultImage,
    showDetails: true,
    presence: 'offline',
    status: 'This would be a long status that would be truncated. This would be a long status that would be truncated. ',
  },
  {
    id: 'bradley.hawkins',
    name: 'Bradley Hawkins',
    avatarSrc: defaultImage,
    showDetails: true,
    presence: 'away',
    presenceText: 'In a meeting',
    status: 'This would be a long status that would be truncated. This would be a long status that would be truncated. ',

  },
  {
    id: 'julio.ortega',
    name: 'Tico Ortega',
    avatarSrc: defaultImage,
  },
  {
    id: 'ignacio.ropolo',
    name: 'Ignacio Ropolo',
    avatarSrc: defaultImage,
  },
  {
    id: 'nina.repetto',
    name: 'Nina Repetto',
    avatarSrc: defaultImage,
  },
  {
    id: 'long.name',
    name: 'LongnameLongnameLongnameLongnameLongnameLongnameLongnameLongnameLongnameLongnameLongnameLongnameLongnameLongnameLongname',
    avatarSrc: defaultImage,
  },
  {
    id: 'long.name.with.spaces',
    name: 'Long Name Long Name Long Name Long NameLong Name Long Name Long Name Long NameLong Name Long Name Long Name Long NameLong Name Long Name Long Name Long NameLong Name Long Name Long Name Long Name ',
    avatarSrc: defaultImage,
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
