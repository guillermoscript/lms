import { CollectionConfig } from 'payload/types';
import { isAdmin } from '../access/isAdmin';
import { isAdminOrSelf } from '../access/isAdminOrSelf';

// Example Collection - For reference only, this must be added to payload.config.ts to be used.
const Zelles: CollectionConfig = {
    slug: 'zelle',
    admin: {
        useAsTitle: 'email'
    },
    access: {
		// everyone can create a user
		create: () => true,
		// Admins can read all, but any other logged in user can only read themselves
		read: isAdminOrSelf,
		// Admins can update all, but any other logged in user can only update themselves
		update: isAdminOrSelf,
		// Only admins can delete
		delete: isAdmin,
	},
    fields: [
        {
            name: 'email',
            type: 'email',
            required: true,
        },
        {
            name: 'FullName',
            type: 'text',
            required: true,
            label: 'Nombre completo',
        },
        // {
        //     name: 'referenceNumber',
        //     type: 'text',
        //     required: true,
        //     label: 'Número de referencia',
        // }
    ],
}

export default Zelles;