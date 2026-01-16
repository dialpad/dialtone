import defaultImage from '@/common/assets/avatar2.png';


const CONTACT_LIST = [
  {
    id: 'test.person',
    name: 'Test Person',
    contactKey: '123',
    avatarSrc: defaultImage,
    showDetails: true,
    presence: 'active',
    presenceText: '',
    status: 'This is a test status',
  },
  {
    id: 'test.person2',
    name: 'Test Person 2',
    contactKey: '1234',
    avatarSrc: defaultImage,
    showDetails: true,
    presence: 'busy',
    presenceText: 'DND',
    status: 'This is a test status',
  },
  {
    id: 'test.person3',
    name: 'Test Person 3',
    contactKey: '12345',
    avatarSrc: defaultImage,
    showDetails: true,
    presence: 'busy',
    presenceText: 'DND',
    status: '',
  },
  {
    id: 'brad.paugh',
    name: 'Brad Paugh',
    contactKey: '123456',
    avatarSrc: defaultImage,
    showDetails: true,
    presence: 'offline',
    status: 'This would be a long status that would be truncated. This would be a long status that would be truncated. ',
  },
  {
    id: 'bradley.hawkins',
    name: 'Bradley Hawkins',
    contactKey: '1234567',
    avatarSrc: defaultImage,
    showDetails: true,
    presence: 'away',
    presenceText: 'In a meeting',
    status: 'This would be a long status that would be truncated. This would be a long status that would be truncated. ',

  },
  {
    id: 'julio.ortega',
    name: 'Tico Ortega',
    contactKey: '12345678',
    avatarSrc: defaultImage,
  },
  {
    id: 'ignacio.ropolo',
    name: 'Ignacio Ropolo',
    contactKey: '123456789',
    avatarSrc: defaultImage,
  },
  {
    id: 'nina.repetto',
    name: 'Nina Repetto',
    contactKey: '123456789',
    avatarSrc: defaultImage,
  },
  {
    id: 'long.name',
    name: 'LongnameLongnameLongnameLongnameLongnameLongnameLongnameLongnameLongnameLongnameLongnameLongnameLongnameLongnameLongname',
    avatarSrc: defaultImage,
    contactKey: '1234567890',
  },
  {
    id: 'long.name.with.spaces',
    name: 'Long Name Long Name Long Name Long NameLong Name Long Name Long Name Long NameLong Name Long Name Long Name Long NameLong Name Long Name Long Name Long NameLong Name Long Name Long Name Long Name ',
    avatarSrc: defaultImage,
    contactKey: '12345678901',
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
