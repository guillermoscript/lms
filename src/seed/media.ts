import path from 'path'
import type { Payload } from 'payload'
import tryCatch from '../utilities/tryCatch'

const image1 = path.join(__dirname, './image/media1.png')
const image2 = path.join(__dirname, './image/media2.png')

const mediaData = [
    {
        collection: 'medias',
        filePath: image1,
        data: {
            filename: 'media1.png',
            altText: 'media1',
        }
    },
    {
        collection: 'medias',
        filePath: image2,
        data: {
            filename: 'media2.png',
            altText: 'media2',
        }
    }
]

export const MediaSeed = async (payload: Payload): Promise<void> => {

    for (let index = 0; index < mediaData.length; index++) {
        const media = mediaData[index];
        const [mediaDoc, err] = await tryCatch(payload.create(media))

        if (err) {
            payload.logger.error(`Error seeding media ${media.data.filename}: ${err.message}`)
        } else {
            payload.logger.info(`Media seeded ${media.data.filename}`)
        }
    }
}
