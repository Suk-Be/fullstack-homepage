import { faker } from '@faker-js/faker';

const userFactory = (role = 'user') => {
    return {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        password: faker.internet.password({ length: 8 }),
        role: role
    };
};

export default userFactory;
