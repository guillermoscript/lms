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

export default buildConfig({
  serverURL: 'http://localhost:3001',
  admin: {
    user: Users.slug,
    meta: {
      titleSuffix: 'LMS Admin',
    },
  },
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
    }
  })],
});
