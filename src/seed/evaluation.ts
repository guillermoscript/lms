import { Seeder } from ".";

const evaluationData: Seeder = [
    {
        collection: 'evaluations',
        data: {
            name: 'JavaScript Exam',
            description: 'A test to evaluate your JavaScript skills',
            endDate: '2025-12-31',
            maxScore: 100,
            score: 10,
            order: 1,
            evaluationType: 'exam',
        },
    },
    {
        collection: 'evaluations',
        data: {
            name: 'Python Exam',
            description: 'A test to evaluate your Python skills',
            endDate: '2025-12-31',
            maxScore: 100,
            score: 14,
            order: 2,
            evaluationType: 'exam',
        },
    }
    // {
    //     collection: 'evaluations',
    //     data: {
    //         id: '2',
    //         name: 'CSS Homework',
    //         description: 'A homework assignment to test your CSS skills',
    //         endDate: '2022-12-31',
    //         maxScore: 50,
    //         evaluationType: 'homework',
    //         homework: [
    //             {
    //                 content: [
    //                     {
    //                         type: 'paragraph',
    //                         children: [
    //                             {
    //                                 text: 'Create a responsive layout using CSS Grid',
    //                             },
    //                         ],
    //                     },
    //                 ],
    //             },
    //         ],
    //     }
    // }
];

export default evaluationData;