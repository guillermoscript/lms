import { Seeder } from ".";

const lessonsData: Seeder = [
    {
        collection: 'lessons',
        data: {
            name: 'Introduction to JavaScript',
            description: 'Learn the basics of JavaScript programming language',
            category: ['Programming', 'JavaScript'],
            content: [
                {
                    children: [
                        {
                            text: 'JavaScript is a programming language that is used to create interactive effects within web browsers.',
                        },
                        {
                            text: ' Here is a ',
                        },
                        {
                            type: 'link',
                            linkType: 'custom',
                            url: 'https://www.w3schools.com/js/',
                            children: [
                                {
                                    text: 'JavaScript tutorial',
                                },
                            ],
                        },
                        {
                            text: ' to get you started.',
                        },
                    ],
                },
            ],
            isPublic: true,
            score: 8,
            order: 1,
            slug: 'introduction-to-javascript',
        },
    },
    {
        collection: 'lessons',
        data: {
            name: 'Introduction to Python',
            description: 'Learn the basics of Python programming language',
            content: [
                {
                    children: [
                        {
                            text: 'Python is a high-level programming language that is used for web development, data analysis, artificial intelligence, and more.',
                        },
                        {
                            text: ' Here is a ',
                        },
                        {
                            type: 'link',
                            linkType: 'custom',
                            url: 'https://www.w3schools.com/python/',
                            children: [
                                {
                                    text: 'Python tutorial',
                                },
                            ],
                        },
                        {
                            text: ' to get you started.',
                        },
                    ],
                },
            ],
            isPublic: true,
            score: 15,
            order: 2,
            slug: 'introduction-to-python',
        },
    }
];

export default lessonsData