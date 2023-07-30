import { Seeder } from ".";

const courseSeed: Seeder = [
    {
        collection: 'courses',
        data: {
            name: 'JavaScript for Beginners',
            description: 'A course to learn the basics of JavaScript programming',
            teacher: 'John Doe',
            isPublic: true,
            slug: 'javascript-for-beginners',
            updatedAt: new Date().toISOString(),
            createdAt: new Date().toISOString(),
        },
    },
    {
        collection: 'courses',
        data: {
            name: 'Advanced Web Development',
            description: 'A course to learn advanced web development techniques',
            teacher: 'Jane Doe',
            isPublic: true,
            slug: 'advanced-web-development',
            updatedAt: new Date().toISOString(),
            createdAt: new Date().toISOString(),
        },
    },
];

export default courseSeed;