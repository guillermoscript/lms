
import type { Payload } from 'payload'
import { mediaData } from './media'
import tryCatch from '../utilities/tryCatch';
import { Media } from '../payload-types';
import { categoriesData } from './category';

async function seeder<T>(payload: Payload, collectionData: Array<{
    collection: string,
    filePath?: string,
    data: any
}>) {
    const data: Array<T> = []
    for (let index = 0; index < collectionData.length; index++) {
        const collection = collectionData[index];
        const [response, err] = await tryCatch(payload.create(collection))

        if (err) {
            payload.logger.error(`Error seeding ${collection.collection}: ${err.message}`)
            return [null , err]
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
    
    console.log(media, '<----------- media');
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

    console.log(categoriesSeeded, '<----------- categoriesSeeded')

    payload.logger.info('Seeding complete')

}