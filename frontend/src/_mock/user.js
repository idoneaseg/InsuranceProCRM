import { faker } from '@faker-js/faker';

// ----------------------------------------------------------------------

const users = [...Array(24)].map(() => ({
  id: faker.string.uuid(),
  avatarUrl: `/assets/images/avatars/avatar_${faker.number.int({ min: 1, max: 25 })}.jpg`,
  name: faker.person.fullName(),
  company: faker.company.name(),
  isVerified: faker.datatype.boolean(),
  status: faker.helpers.arrayElement(['active', 'banned']),
  role: faker.person.jobTitle(),
}));

export default users;
