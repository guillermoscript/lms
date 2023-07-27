// Seed data for users
const usersData = [
    {
        collection: 'users',
        data: {
            id: '1',
            firstName: 'John',
            lastName: 'Doe',
            phone: '1234567890',
            address: '123 Main St',
            birthDate: '1990-01-01',
            gender: 'male',
            roles: ['admin'],
            slug: 'john-doe',
            email: 'john.doe@example.com',
            password: 'password123',
        }
    },
    {
        collection: 'users',
        data: {
            id: '2',
            firstName: 'Jane',
            lastName: 'Doe',
            phone: '0987654321',
            address: '456 Elm St',
            birthDate: '1995-01-01',
            gender: 'female',
            roles: ['user'],
            slug: 'jane-doe',
            email: 'jane.doe@example.com',
            password: 'password456',
        }
    },
    {
        collection: 'users',
        data: {
            id: '3',
            firstName: 'Bob',
            lastName: 'Smith',
            phone: '5555555555',
            address: '789 Oak St',
            birthDate: '1985-01-01',
            gender: 'other',
            roles: ['teacher'],
            slug: 'bob-smith',
            email: 'bob.smith@example.com',
            password: 'password789',
        }
    },
];

export default usersData