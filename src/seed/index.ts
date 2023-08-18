
import type { Payload } from 'payload'
import { mediaData } from './media'
import tryCatch from '../utilities/tryCatch';
import { Media } from '../payload-types';
import { categoriesData } from './category';
import usersData from './user';
import lessonsData from './lessons';
import programmingExam from './Exam';
import evaluationData from './evaluation';
import courseSeed from './course';
import plansSeed from './plans';
import productsSeed from './product';

export type Seeder = Array<{
    collection: string,
    filePath?: string,
    data: any
}>

async function seeder<T>(payload: Payload, collectionData: Seeder) {
    const data: Array<T> = []
    for (let index = 0; index < collectionData.length; index++) {
        const collection = collectionData[index];
        const [response, err] = await tryCatch(payload.create(collection))

        if (err) {
            payload.logger.error(`Error seeding ${collection.collection}: ${err.message}`)
            return [null, err]
        } else {
            payload.logger.info(`${collection.collection} seeded`)
            data.push(response)
        }
    }
    return [data, null]
}

export const seed = async (payload: Payload): Promise<void> => {

    const [media, err] = await seeder<Media>(payload, mediaData)

    if (err || !media) return

    const categories = categoriesData.map((category, index) => {
        // TODO: Fix this
        // @ts-ignore
        const mediaId = (media[index] as Media).id as string
        return {
            ...category,
            data: {
                ...category.data,
                image: mediaId
            }
        }
    })

    const [categoriesSeeded, err2] = await seeder(payload, categories)

    if (err2 || !categoriesSeeded) return

    const [users, err3] = await seeder(payload, usersData)

    if (err3 || !users) return

    const lessons = lessonsData.map((lesson, index) => {
        // TODO: Fix this
        return {
            ...lesson,
            data: {
                ...lesson.data,
                // @ts-ignore
                category: categoriesSeeded[index].id,
                // @ts-ignore
                teacher: users[2].id
            }
        }
    })

    const [lessonsSeeded, err4] = await seeder(payload, lessons)

    if (err4 || !lessonsSeeded) return

    // const [exams, err5] = await seeder(payload, programmingExam)

    // if (err5 || !exams) return

    const evaluations = evaluationData.map((evaluation, index) => {
        return {
            ...evaluation,
            data: {
                ...evaluation.data,
                exam: {
                    content: [
                        {
                            type: 'paragraph',
                            children: [
                                {
                                    text: 'Create a responsive layout using CSS Grid',
                                },
                            ],
                        },
                    ],
                    timeToAnswer: 20
                }
            }
        }
    })

    const [evaluationsSeeded, err6] = await seeder(payload, evaluations)

    if (err6 || !evaluationsSeeded) return

    const course = courseSeed.map((course, index) => {
        return {
            ...course,
            data: {
                ...course.data,
                // @ts-ignore
                category: categoriesSeeded[index].id,
                // @ts-ignore
                teacher: users[2].id,
                // @ts-ignore
                lessons: [lessonsSeeded[index].id],
                // @ts-ignore
                evaluations: [evaluationsSeeded[index].id]
            }
        }
    })

    const [courseSeeded, err7] = await seeder(payload, course)

    if (err7 || !courseSeeded) return


    const plans = plansSeed.map((plan, index) => {
        return {
            ...plan,
            data: {
                ...plan.data,
                // @ts-ignore
                courses: [courseSeeded[index].id],
                // @ts-ignore
                category: [categoriesSeeded[index].id]
            }
        }
    })

    const [plansSeeded, err8] = await seeder(payload, plans)

    if (err8 || !plansSeeded) return

    const products = productsSeed.map((product, index) => {
        return {
            ...product,
            data: { ...product.data }
        }
    })
    // @ts-ignore
    products[0].data.productType = {
        relationTo: 'courses',
        // @ts-ignore
        value: courseSeeded[0].id
    }
    // @ts-ignore
    products[0].data.productImage = media[0].id
    // @ts-ignore
    products[1].data.productType = {
        relationTo: 'plans',
        // @ts-ignore
        value: plansSeeded[0].id
    }
    // @ts-ignore
    products[1].data.productImage = media[1].id

    const [productsSeeded, err9] = await seeder(payload, products)

    if (err9 || !productsSeeded) return

    payload.logger.info('Seeding complete')

}