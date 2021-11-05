const faker = require('faker');
const profiles = [...new Array(100)].map((i, idx) => ({
  id:
    idx === 0
      ? 'https://dev-28839849.okta.com::Paul_Welch45@yahoo.com'
      : faker.random.alphaNumeric(20),
  avatarUrl: faker.image.avatar(),
  email: idx === 0 ? 'Paul_Welch45@yahoo.com' : faker.internet.email(),
  name:
    idx === 0
      ? 'Paul Welch'
      : `${faker.name.firstName()} ${faker.name.lastName()}`,
}));

exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex('profiles')
    .del()
    .then(function () {
      // Inserts seed entries
      return knex('profiles').insert(profiles);
    });
};
