import { faker } from '@faker-js/faker';
import { factory, primaryKey } from '@mswjs/data';

// factory describes the data
export const db = factory({
    // create category model
    // each model must have an primary key
    // the property values are getters (except for the primary key).
    // e.g. faker.commerce.department is referecne to the function, it is not called like faker.commerce.department()
    // category: {
    //     id: primaryKey(faker.number.int),
    //     name: faker.commerce.department,
    //     products: manyOf('product'),
    // },
    // product: {
    //     id: primaryKey(faker.number.int),
    //     // do not call faker method, its value needs to be a getter
    //     name: faker.commerce.productName,
    //     // needs to be int, in the app price typed as number
    //     price: () => faker.number.int({ min: 1, max: 100 }),
    //     categoryId: faker.number.int,
    //     category: oneOf('category'),
    // },
    user: {
        id: primaryKey(String),
        name: () => faker.person.fullName(),
        email: () => faker.internet.email(),
        password: String,
        // google_id: generateNullableGoogleId,
        // email_verified_at: generateDate,
        // created_at: generateDate,
        // updated_at: generateDate,
    },
});
