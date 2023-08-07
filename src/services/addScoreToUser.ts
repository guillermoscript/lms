import { Payload } from "payload"
import { User } from "../payload-types"
import tryCatch from "../utilities/tryCatch"

export default async function addScoreToUser(score: number, user: User, payload: Payload) {
    
    try {
        const userScore: User = await payload.findByID({
            collection: 'users',
            id: user.id,
        })

        if (!userScore) {
            return
        }

        const userScoreData = userScore?.score
        // for now every lesson is worth 10 points
        const newScore = userScoreData ? userScoreData + score : score
        const [updatedUser, error] = await tryCatch(payload.update({
            collection: 'users',
            id: user.id,
            data: {
                score: newScore
            }
        }))

        if (error) {
            console.log(error)
            return
        }
        console.log(updatedUser, "updatedUser")
        return updatedUser
    } catch (error) {
        return error
    }
}