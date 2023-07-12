import { CollectionConfig } from 'payload/types';
import { anyone } from '../../access/anyone';

import { isAdmin, isAdminFieldLevel } from '../../access/isAdmin';
import { isAdminOrSelf } from '../../access/isAdminOrSelf';
import { populateCreatedBy } from '../../hooks/populateCreatedBy';
import { populateLastModifiedBy } from '../../hooks/populateLastModifiedBy';
import { slugField } from '../../fields/slug';
import { User } from '../../payload-types';

const Users: CollectionConfig = {
	slug: 'users',
	auth: {
		forgotPassword: {
			generateEmailHTML: (args) => {
				// const { req, token, user } = args;
				args?.req
			  // Use the token provided to allow your user to reset their password
			  	const resetPasswordURL = `${process.env.PAYLOAD_PUBLIC_FRONTEND_URL}/auth/reset-password?token=${args?.token}`;
	  
			  return `
				<!doctype html>
				<html>
				  <body>
					<h1>Hola, ${(args?.user as User)?.firstName || 'usuario'}</h1>
					<p>Estás recibiendo esto porque tú (o alguien más) ha solicitado restablecer la contraseña de tu cuenta. Por favor haz click en el siguiente enlace o pégalo en tu navegador para completar el proceso: </p>
					<a href="${resetPasswordURL}">${resetPasswordURL}</a>
					<p>Si no solicitaste esto, por favor ignora este correo y tu contraseña permanecerá sin cambios.</p>
				  </body>
				</html>
			  `;
			}
		  }
	},
	admin: {
		useAsTitle: 'email',
		// user: 'admin'
		defaultColumns: ['email', 'firstName', 'lastName', 'phone', 'address', 'roles'],
		group: 'Información de usuarios',
	},
	access: {
		// everyone can create a user
		create: anyone,
		// Admins can read all, but any other logged in user can only read themselves
		read: anyone,
		// Admins can update all, but any other logged in user can only update themselves
		update: ( { req: { user } } ) => {
			if (!user) {
				return false
			}
			if (user.roles.includes('admin')) {
				return true
			}
			return {
				id: user.id
			}
		},
		// Only admins can delete
		delete: isAdmin,
		admin: ({ req: { user } }) => {
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
			],
		},
		{
			type: 'row',
			fields: [
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
				},
				{
					name: 'gender',
					label: 'Género',
					type: 'select',
					required: false,
					options: [
						{
							label: 'Masculino',
							value: 'male',
						},
						{
							label: 'Femenino',
							value: 'female',
						},
						{
							label: 'Otro',
							value: 'other',
						},
					],
				}
			]
		},
		{
			name: 'profilePicture',
			type: 'upload',
			required: false,
			relationTo: 'medias',
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
			defaultValue: ['user'],
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
		{
			name: 'photo',
			type: 'upload',
			relationTo: 'medias',
			// required: true,
			// admin: {
			// 	position: 'sidebar',
			// }	
		},
		slugField('email'),
	],
	hooks: {
		beforeChange: [
			populateCreatedBy,
			populateLastModifiedBy,

		]
	},
};

export default Users;