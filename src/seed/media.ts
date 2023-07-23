import path from 'path'

const image1 = path.join(__dirname, './image/media1.png')
const image2 = path.join(__dirname, './image/media2.png')

export const mediaData = [
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
