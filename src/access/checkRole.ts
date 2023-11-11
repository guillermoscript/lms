import { User } from "../payload-types"

export const checkRole = (allRoles: User['roles'] = [], user?: User): boolean => {
    if (!user) {
        return false
    }

    const checkRoles = allRoles.some(role => {
        return user?.roles?.some(individualRole => {
            return individualRole === role
        })
    })

    return checkRoles
}
