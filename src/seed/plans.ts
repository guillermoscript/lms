import { Seeder } from ".";

const plansSeed: Seeder = [
    {
        collection: 'plans',
        data: {
            id: '1',
            name: 'Basic Plan',
            description: 'A basic plan with access to a limited number of courses',
            status: 'active',
            subscriptions: [],
            periodicity: 'monthly',
            slug: 'basic-plan',
        },
    },
    {
        collection: 'plans',
        data: {
            id: '2',
            name: 'Premium Plan',
            description: 'A premium plan with access to all courses and exclusive content',
            status: 'active',
            subscriptions: [],
            periodicity: 'annual',
            slug: 'premium-plan',
        },
    },
];

export default plansSeed;