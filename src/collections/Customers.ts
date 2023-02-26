import { CollectionConfig } from 'payload/types';

import { isAdmin, isAdminFieldLevel } from '../access/isAdmin';
import { isAdminOrSelf } from '../access/isAdminOrSelf';
const Customers: CollectionConfig = {
	slug: 'customers',
	auth: true,
	admin: {
		useAsTitle: 'email',
		defaultColumns: ['email', 'firstName', 'lastName', 'roles'],
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
		// admin:  ({ req: { user } }) => { 
		// 	if (user.roles.includes('admin')) {
		// 		return true
		// 	}
		// 	return false
		// },

	},
	fields: [
		// Email added by default
		{
			type: 'row',
			fields: [
				{
					name: 'firstName',
					label: 'Nombre',
					type: 'text',
					required: true,
				},
				{
					name: 'lastName',
					label: 'Apellido',
					type: 'text',
					required: true,
				},
				{
					name: 'phone',
					label: 'Teléfono',
					type: 'text',
					required: false,
				}
			],
		},
		{
			name: 'roles',
			// Save this field to JWT so we can use from `req.user`
			saveToJWT: true,
			type: 'select',
			hasMany: true,
			access: {
				// Only admins can create or update a value for this field
				create: isAdminFieldLevel,
				update: isAdminFieldLevel,
			},
			options: [
				{
					label: 'Estudiante',
					value: 'student',
				}
			]
		},

	],
};

export default Customers;