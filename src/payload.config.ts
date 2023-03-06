import { buildConfig } from 'payload/config';
import path from 'path';
// import Examples from './collections/Examples';
import Users from './collections/Users/Users';
import PagoMovils from './collections/PagoMovils';
import Transactions from './collections/Transactions/Transactions';
import PaymentMethods from './collections/PaymentMethods';
import Zelles from './collections/Zelles';
import Courses from './collections/Courses';
import Currencies from './collections/Currencies';
import Enrollments from './collections/Enrollments';
import Subscriptions from './collections/Subscriptions';
import ProductPrices from './collections/ProductPrices';
import Products from './collections/Products';
import Evaluations from './collections/Evaluations';
import Exams from './collections/Exams';
import Homeworks from './collections/Homeworks';
import Lessons from './collections/Lessons';
import Plans from './collections/Plans';
import Customers from './collections/Customers';
import Media from './collections/Media';

export default buildConfig({
  serverURL: 'http://localhost:3000',
  admin: {
    user: Users.slug,
  },
  collections: [
    Courses,
    Customers,
    Currencies,
    Enrollments,
    Evaluations,
    Exams,
    Homeworks,
    Media,
    Lessons,
    PagoMovils,
    PaymentMethods,
    Plans,
    ProductPrices,
    Products,
    Subscriptions,
    Transactions,
    Users,
    Zelles,
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
