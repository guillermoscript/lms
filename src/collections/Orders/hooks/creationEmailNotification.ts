import payload from 'payload';
import { Message } from 'payload/dist/email/types';
import { CollectionAfterChangeHook } from 'payload/types';
import { Order, User } from '../../../payload-types';
import { noReplyEmail } from '../../../utilities/consts';

export const creationEmailNotification: CollectionAfterChangeHook = async ({
  doc, // full document data
  req, // full express request
  previousDoc, // document data before updating the collection
  operation, // name of the operation ie. 'create', 'update'
}: {
    doc: Order
    req: any
    previousDoc: Order
    operation: "create" | "update" | "delete"
}) => {

    if (operation === 'create') {
        // send email
        const userId = typeof doc.customer === 'string' ? { id: doc.customer } : doc.customer;
        const [user, userError] = await findUserById(userId ? userId.id : '');
        if (userError) {
            console.log("error on user", userError);
            return
        }
        const mailOptions: Message = {
            from: noReplyEmail,
            to: user.email as string,
            subject: 'Nueva orden',
            html: `<h1>¡Hola ${user.firstName}!</h1>
            <p>Se ha creado una nueva orden con el número ${previousDoc.id}.</p>
            <p>Para ver el estado de tu orden, puedes ingresar a tu cuenta en <a href="https://pincelx.com">pincelx.com</a></p>
            <p>¡Gracias por tu compra!</p>
            <p>Equipo de Pincel X</p>`
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