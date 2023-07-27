import { Seeder } from ".";

const programmingExam: Seeder = [
    {
        collection: 'examns',
        data: {
            title: 'Programming Exam',
            fields: [
                {
                    name: 'name',
                    label: 'Name a programming language',
                    width: 12,
                    required: true,
                    blockType: 'text',
                },
                {
                    name: 'programmingLanguage',
                    label: 'Select a programming language',
                    width: 12,
                    required: true,
                    options: [
                        {
                            label: 'HTML',
                            value: 'html',
                        },
                        {
                            label: 'CSS',
                            value: 'css',
                        },
                        {
                            label: 'JavaScript',
                            value: 'javascript',
                        },
                    ],
                    blockType: 'select',
                },
                {
                    name: 'programmingChallenge',
                    label: 'Is JavaScript a programming language? explain why or why not',
                    width: 12,
                    required: true,
                    blockType: 'textarea',
                },
                {
                    name: 'termsAndConditions',
                    label: 'Javascript is a compiled language?',
                    width: 12,
                    required: true,
                    defaultValue: false,
                    blockType: 'checkbox',
                },
            ],
            submitButtonLabel: 'Submit',
            confirmationType: 'message',
            confirmationMessage: [
                {
                    type: 'paragraph',
                    children: [
                        {
                            text: 'Thank you for submitting the web development exam. We will review your submission and get back to you shortly.',
                        },
                    ],
                },
            ],
        },
    },
    {
        collection: 'examns',
        data: {
            title: 'Web Development Exam',
            fields: [
                {
                    name: 'name',
                    label: 'Name',
                    width: 12,
                    required: true,
                    blockType: 'text',
                },
                {
                    name: 'programmingExperience',
                    label: 'Programming Experience',
                    width: 12,
                    required: true,
                    defaultValue: 'beginner',
                    options: [
                        {
                            label: 'Beginner',
                            value: 'beginner',
                        },
                        {
                            label: 'Intermediate',
                            value: 'intermediate',
                        },
                        {
                            label: 'Advanced',
                            value: 'advanced',
                        },
                    ],
                    blockType: 'select',
                },
                {
                    name: 'webDevelopmentChallenge',
                    label: 'Build a responsive website using HTML, CSS, and JavaScript',
                    width: 12,
                    required: true,
                    blockType: 'textarea',
                },
                {
                    name: 'termsAndConditions',
                    label: 'I agree to the terms and conditions',
                    width: 12,
                    required: true,
                    defaultValue: false,
                    blockType: 'checkbox',
                },
            ],
            submitButtonLabel: 'Submit',
            confirmationType: 'message',
            confirmationMessage: [
                {
                    type: 'paragraph',
                    children: [
                        {
                            text: 'Thank you for submitting the web development exam. We will review your submission and get back to you shortly.',
                        },
                    ],
                },
            ],
        },
    },
];

export default programmingExam;