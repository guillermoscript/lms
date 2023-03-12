import payload from 'payload';
import { Message } from 'payload/dist/email/types';
import { CollectionAfterChangeHook } from 'payload/types';
import { Transaction, User } from '../../../payload-types';

export const creationEmailNotification: CollectionAfterChangeHook = async ({
  doc, // full document data
  req, // full express request
  previousDoc, // document data before updating the collection
  operation, // name of the operation ie. 'create', 'update'
}: {
    doc: Transaction
    req: any
    previousDoc: Transaction
    operation: "create" | "update" | "delete"
}) => {

    if (operation === 'create') {
        // send email
        const userId = doc.customer as User;
        const [user, userError] = await findUserById(userId.id);
        if (userError) {
            console.log(userError);
            return
        }
        const mailOptions: Message = {
            from: 'noreply@pincelx.com',
            to: user.email as string,
            subject: 'test subject',
            html: 'test html',
        };
        payload.sendEmail(mailOptions)
    }
}

async function findUserById(userId: User['id']) {
    try {
        const user = await payload.findByID({
            collection: 'users',
            id: userId,
        });
        return [user, null]
    } catch (error) {
        const er = error as Error
        return [null, error]
    }
}