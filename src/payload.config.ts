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

export default buildConfig({
  serverURL: 'http://localhost:3000',
  admin: {
    user: Users.slug,
  },
  collections: [
    Courses,
    Currencies,
    Enrollments,
    Evaluations,
    Media,
    PaymentMethods,
    Plans,
    Products,
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
  }
});
