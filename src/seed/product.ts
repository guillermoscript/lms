import { Seeder } from ".";

const productsSeed: Seeder = [
    {
        collection: 'products',
        data: {
            name: 'JavaScript for Beginners Course',
            description: 'A course to learn the basics of JavaScript programming',
            
            productStatus: 'active',
            productPrice: [
                {
                    price: 50,
                    aceptedCurrency: 'USD',
                },
            ],
            info: [
                {
                    type: 'paragraph',
                    children: [
                        {
                            text: 'This course is perfect for beginners who want to learn JavaScript programming.',
                        },
                    ],
                },
                {
                    type: 'list',
                    children: [
                        {
                            type: 'list-item',
                            children: [
                                {
                                    text: 'Learn the basics of JavaScript programming',
                                },
                            ],
                        },
                        {
                            type: 'list-item',
                            children: [
                                {
                                    text: 'Create interactive web applications',
                                },
                            ],
                        },
                        {
                            type: 'list-item',
                            children: [
                                {
                                    text: 'Get hands-on experience with real-world projects',
                                },
                            ],
                        },
                    ],
                },
            ],
            slug: 'javascript-for-beginners-course',

        },
    },
    {
        collection: 'products',
        data: {
            name: 'Premium Plan Subscription',
            description: 'A subscription to access all courses and exclusive content',
            productType: {
                relationTo: 'plans',
            },
            productStatus: 'active',
            productPrice: [
                {
                    price: 100,
                    aceptedCurrency: 'USD',
                },
            ],
            info: [
                {
                    type: 'paragraph',
                    children: [
                        {
                            text: 'Get access to all courses and exclusive content with our Premium Plan Subscription.',
                        },
                    ],
                },
                {
                    type: 'list',
                    children: [
                        {
                            type: 'list-item',
                            children: [
                                {
                                    text: 'Access to all courses related to programming and web development',
                                },
                            ],
                        },
                        {
                            type: 'list-item',
                            children: [
                                {
                                    text: 'Exclusive content only available to Premium Plan subscribers',
                                },
                            ],
                        },
                        {
                            type: 'list-item',
                            children: [
                                {
                                    text: 'Priority support from our team of experts',
                                },
                            ],
                        },
                    ],
                },
            ],
            slug: 'premium-plan-subscription',

        },
    },
];

export default productsSeed;