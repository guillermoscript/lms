import { CollectionConfig } from 'payload/types';

import { isAdmin, isAdminFieldLevel } from '../../access/isAdmin';
import { isAdminOrSelf } from '../../access/isAdminOrSelf';
const Users: CollectionConfig = {
	slug: 'users',
	auth: true,
	admin: {
		useAsTitle: 'email',
		// user: 'admin'
		defaultColumns: ['email', 'firstName', 'lastName', 'phone', 'address', 'roles'],
	},
	access: {
		// everyone can create a user
		create: isAdmin,
		// Admins can read all, but any other logged in user can only read themselves
		read: isAdminOrSelf,
		// Admins can update all, but any other logged in user can only update themselves
		update: isAdminOrSelf,
		// Only admins can delete
		delete: isAdmin,
		admin:  ({ req: { user } }) => { 
			if (user.roles.includes('user')) {
				return false
			}
			return true
		}
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
				},
				{
					name: 'address',
					label: 'Dirección',
					type: 'text',
					required: false,
				},
				{
					name: 'birthDate',
					label: 'Fecha de nacimiento',
					type: 'date',
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
					label: 'Admin',
					value: 'admin',
				},
				{
					label: 'Profesor',
					value: 'teacher',
				},
				{
					label: 'Editor',
					value: 'editor'
				},
				{
					label: 'Usuario',
					value: 'user'
				}
			]
		},

	],
};

export default Users;