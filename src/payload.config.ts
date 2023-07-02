import { buildConfig } from 'payload/config';
import path from 'path';
import Users from './collections/Users/Users';
import Orders from './collections/Orders/Orders';
import PaymentMethods from './collections/PaymentMethods';
import Courses from './collections/Courses';
import Currencies from './collections/Currencies';
import Enrollments from './collections/Enrollments';
import Subscriptions from './collections/Subscriptions';
import Products from './collections/Products';
import Evaluations from './collections/Evaluations';
import Plans from './collections/Plans';
import Media from './collections/Media';
import Categories from './collections/Categories';
import Comments from './collections/Comments';
import Lessons from './collections/Lessons';
import Reviews from './collections/Reviews';
import FormBuilder from '@payloadcms/plugin-form-builder';
import { createdByField } from './fields/createdBy';
import { populateCreatedBy } from './hooks/populateCreatedBy';
import { populateLastModifiedBy } from './hooks/populateLastModifiedBy';
import { lastModifiedBy } from './fields/lastModifiedBy ';

export default buildConfig({
  serverURL: 'http://localhost:3001',
  admin: {
    user: Users.slug,
    meta: {
      titleSuffix: 'LMS Admin',
    },
  },
  cors: ['http://localhost:3000','http://localhost:3001'],
  collections: [
    Courses,
    Currencies,
    Categories,
    Comments,
    Enrollments,
    Evaluations,
    Media,
    Lessons,
    PaymentMethods,
    Plans,
    Products,
    Reviews,
    Subscriptions,
    Orders,
    Users,
  ],
  typescript: {
    outputFile: path.resolve(__dirname, 'payload-types.ts'),
  },
  graphQL: {
    schemaOutputFile: path.resolve(__dirname, 'generated-schema.graphql'),
  },
  upload: {
    limits: {
      fileSize: 5000000, // 5MB, written in bytes
    },
  },
  plugins: [FormBuilder({
    fields: {
      payment: false
    },
    formOverrides: {
      slug: 'examns',
      admin: {
        group: "Cursos",
        useAsTitle: "title"
      }
    },
    formSubmissionOverrides: {
      slug: 'examns-submissions',
      admin: {
        group: "Cursos",
        defaultColumns: ['createdAt', 'user', 'score'],
      },
      access: {
        create: () => true,
        read: () => true,
        update: () => true,
      },
      fields: [
        // {
        //   name: 'user',
        //   type: 'relationship',
        //   relationTo: 'users',
        //   hasMany: false,
        // },
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
        createdByField(),
        lastModifiedBy(),
      ],
      hooks: {
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
            if (operation === 'update') {
              // const user = doc.createdBy
              console.log(doc)
              console.log(doc.createdBy)
              try {
                const user = await req.payload.findByID({
                  collection: 'users',
                  id: doc.createdBy,
                })

                req.payload.sendEmail({
                  to: user.email,
                  subject: 'Examen calificado',
                  html: `Hola ${user.firstName} ${user.lastName}, tu examen ha sido calificado, puedes ver los resultados en tu perfil.`,
                  from: 'noreply@pincelx.com',
                })
              } catch (error) {
                console.log(error)
              }
            }
            return doc
          }
        ],
      }
    }
  })],
  // express: {
  //   postMiddleware: [
      
  //   ]
  // }
});
