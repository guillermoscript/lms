import { Access, Field, PayloadRequest } from "payload/types";
import { createdByField } from "../fields/createdBy";
import { lastModifiedBy } from "../fields/lastModifiedBy ";
import { populateLastModifiedBy } from "../hooks/populateLastModifiedBy";
import { populateCreatedBy } from "../hooks/populateCreatedBy";
import { Evaluation, ExamnsSubmission, User } from "../payload-types";
import { noReplyEmail } from "../utilities/consts";
import tryCatch from "../utilities/tryCatch";
import { BeforeOperationHook, BeforeValidateHook, BeforeChangeHook, AfterChangeHook, BeforeReadHook, AfterReadHook, BeforeDeleteHook, AfterDeleteHook, AfterErrorHook, BeforeLoginHook, AfterLoginHook, AfterLogoutHook, AfterMeHook, AfterRefreshHook, AfterForgotPasswordHook } from "payload/dist/collections/config/types";
import { isLoggedIn } from "../access/isLoggedIn";
import { checkRole } from "./Users/checkRole";
import { isAdmin } from "../access/isAdmin";

export const ExamnsSubmissionsFields: Field[] = [

    {
        name: 'evaluation',
        type: 'relationship',
        relationTo: 'evaluations',
        hasMany: false,
    },
    {
        name: 'score',
        type: 'number',
        required: false,
    },
    {
        name: 'teacherComments',
        type: 'richText',
        required: false,
    },
    {
        name: 'approved',
        type: 'radio',
        options: [
            {
                label: 'Aprobado',
                value: 'approved',
            },
            {
                label: 'Reprobado',
                value: 'rejected',
            },
            {
                label: 'Pendiente',
                value: 'pending',
            }
        ],
        defaultValue: 'pending',
        required: true,
    },
    createdByField(),
    lastModifiedBy(),
]

export const ExamnsSubmissionsAccess: {
    create?: Access;
    read?: Access;
    update?: Access;
    delete?: Access;
} = {
    create: isLoggedIn,
    read: ({ req: { user } }) => {
        if (!user) {
            return false
        }
        if (checkRole(['admin', 'editor', 'teacher'], user)) {
            return true
        }

        return {
            createdBy: {
                equals: user.id
            }
        }
    },
    update: ({ req: { user } }) => {
        if (!user) {
            return false
        }
        if (checkRole(['admin', 'editor', 'teacher'], user)) {
            return true
        }

        return false
    },
    delete: isAdmin,
}

export const ExamnsSubmissionsHooks: {
    beforeOperation?: BeforeOperationHook[];
    beforeValidate?: BeforeValidateHook[];
    beforeChange?: BeforeChangeHook[];
    afterChange?: AfterChangeHook[];
    beforeRead?: BeforeReadHook[];
    afterRead?: AfterReadHook[];
    beforeDelete?: BeforeDeleteHook[];
    afterDelete?: AfterDeleteHook[];
    afterError?: AfterErrorHook;
} = {
    beforeChange: [
        populateCreatedBy,
        populateLastModifiedBy,
    ],
    afterChange: [
        async ({
            doc, // full document data
            req, // full express request
            previousDoc, // document data before updating the collection
            operation, // name of the operation ie. 'create', 'update'
        }) => {
            if (operation !== 'update') {
                return doc
            }

            try {
                const user = await req.payload.findByID({
                    collection: 'users',
                    id: doc.createdBy,
                })

                req.payload.sendEmail({
                    to: user.email,
                    subject: 'Examen calificado',
                    html: `Hola ${user.firstName} ${user.lastName}, tu examen ha sido calificado, puedes ver los resultados en tu perfil.`,
                    from: noReplyEmail,
                })
            } catch (error) {
                console.log(error)
            }
        },
        async ({
            doc, // full document data
            req, // full express request
            previousDoc, // document data before updating the collection
            operation, // name of the operation ie. 'create', 'update'
        }) => {

            if (operation !== 'update') {
                return doc
            }

            const [evaluation, evaluationError] = await tryCatch(req.payload.findByID({
                collection: 'evaluations',
                id: doc.evaluation,
            }))

            if (evaluationError) {
                console.log(evaluationError)
                return doc
            }
            const docNow = doc as ExamnsSubmission

            const [user, userError] = await tryCatch(req.payload.findByID({
                collection: 'users',
                id: doc.createdBy,
            }))

            if (userError) {
                console.log(userError)
                return doc
            }

            let subject = ''
            let html = ''

            if (docNow.approved === 'approved') {

                const usersApproved = evaluation.approvedBy ? evaluation.approvedBy.map((user: User) => user.id) : []
                usersApproved.push(doc.createdBy)

                await updateEvaluation(req, user, {
                    approvedBy: usersApproved,
                }, evaluation)

                subject = 'Examen aprobado'
                html = `Hola ${user.firstName} ${user.lastName}, tu examen ha sido aprobado, puedes ver los resultados en tu perfil.`

            } else if (docNow.approved === 'rejected') {

                const userReproved = evaluation.reprovedBy ? evaluation.reprovedBy.map((user: User) => user.id) : []
                userReproved.push(doc.createdBy)

                await updateEvaluation(req, user, {
                    reprovedBy: userReproved,
                }, evaluation)

                subject = 'Examen reprobado'
                html = `Hola ${user.firstName} ${user.lastName}, tu examen ha sido reprobado, puedes ver los resultados en tu perfil.`
            }

            req.payload.sendEmail({
                to: user.email,
                subject,
                html,
                from: noReplyEmail,
            })
        }
    ],
}


async function updateEvaluation(req: PayloadRequest, user: User, data: any, evaluation: Evaluation) {

    const [updatedEvaluation, error] = await tryCatch(req.payload.update({
        collection: 'evaluations',
        id: evaluation.id,
        data: data
    }));

    if (error) {
        console.log(error);
        return;
    }

    return updatedEvaluation;
}
