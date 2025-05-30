import { faker } from '@faker-js/faker';

const userFactory = () => {
    return {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        password: faker.internet.password({ length: 8 }),
    };
};

export default userFactory;
