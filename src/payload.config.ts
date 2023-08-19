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
import pagoMovil from './globals/pago-movil';
import zelle from './globals/zelle';
import { runInactivateSubscriptionAndCreateRenewalOrder } from './lib/cron';
import { StatusCodes } from 'http-status-codes';
import { ExamnsSubmissionsAccess, ExamnsSubmissionsFields, ExamnsSubmissionsHooks } from './collections/ExamnsSubmissions';
import GoogleButton from './components/Google/GoogleButton';
import Notifications from './collections/Notifications';
import Prompts from './collections/Prompt';

export default buildConfig({
  serverURL: 'http://localhost:3000',
  admin: {
    user: Users.slug,
    meta: {
      titleSuffix: 'LMS Admin',
    },

    components: {
      // The BeforeDashboard component renders the 'welcome' block that you see after logging into your admin panel.
      // Feel free to delete this at any time. Simply remove the line below and the import BeforeDashboard statement on line 15.
      // beforeDashboard: [BeforeDashboard],
      beforeLogin: [GoogleButton],
    },
  },
  cors: ['http://localhost:3000', 'http://localhost:3001'],
  collections: [
    Courses,
    Currencies,
    Categories,
    Comments,
    Enrollments,
    Evaluations,
    Media,
    Notifications,
    Lessons,
    PaymentMethods,
    Plans,
    Products,
    Prompts,
    Reviews,
    Subscriptions,
    Orders,
    Users,
  ],
  globals: [
    pagoMovil,
    zelle
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
      access: ExamnsSubmissionsAccess,
      fields: ExamnsSubmissionsFields,
      hooks: ExamnsSubmissionsHooks,
    }
  })],
  endpoints: [
    {
      path: '/v1/inactivate-subscription-and-create-renewal-order',
      method: 'get',
      handler: async (req, res) => {
        try {
          const result = await runInactivateSubscriptionAndCreateRenewalOrder();
          console.log(result, '<----------- result');
          res.status(StatusCodes.OK).send(result);
        } catch (error) {
          console.log(error, '<----------- error');
          res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error);
        }
      },
    }
  ]
});
