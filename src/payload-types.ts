/* tslint:disable */
/**
 * This file was automatically generated by Payload CMS.
 * DO NOT MODIFY IT BY HAND. Instead, modify your source Payload config,
 * and re-run `payload generate:types` to regenerate this file.
 */

export interface Config {}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "courses".
 */
export interface Course {
  id: string;
  name: string;
  description: string;
  teacher?: string | User;
  enrollments?: string[] | Enrollment[];
  createdBy?: string | User;
  lastModifiedBy?: string | User;
  isPublic?: boolean;
  createdAt: string;
  updatedAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "users".
 */
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  phone?: string;
  address?: string;
  birthDate?: string;
  roles?: ('admin' | 'teacher' | 'editor' | 'user')[];
  email?: string;
  resetPasswordToken?: string;
  resetPasswordExpiration?: string;
  loginAttempts?: number;
  lockUntil?: string;
  createdAt: string;
  updatedAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "enrollments".
 */
export interface Enrollment {
  id: string;
  student?: string | User;
  course?: string | Course;
  status?: 'active' | 'inactive';
  order?: string | Order;
  createdAt: string;
  updatedAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "orders".
 */
export interface Order {
  id: string;
  amount: number;
  status?: 'active' | 'inactive';
  customer?: string | User;
  products?: string[] | Product[];
  details?: {
    [k: string]: unknown;
  }[];
  referenceNumber?: string;
  createdBy?: string | User;
  lastModifiedBy?: string | User;
  createdAt: string;
  updatedAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "products".
 */
export interface Product {
  id: string;
  name: string;
  description: string;
  productPrices?: string[] | ProductPrice[];
  productType?:
    | {
        value: string | Course;
        relationTo: 'courses';
      }
    | {
        value: string | Plan;
        relationTo: 'plans';
      };
  lastModifiedBy?: string | User;
  createdBy?: string | User;
  createdAt: string;
  updatedAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "product-prices".
 */
export interface ProductPrice {
  id: string;
  price: number;
  currency?: string[] | Currency[];
  lastModifiedBy?: string | User;
  createdBy?: string | User;
  createdAt: string;
  updatedAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "currencies".
 */
export interface Currency {
  id: string;
  name: string;
  symbol: string;
  exchangeRate: number;
  createdAt: string;
  updatedAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "plans".
 */
export interface Plan {
  id: string;
  name: string;
  description: string;
  status?: 'active' | 'inactive';
  courses?: string[] | Course[];
  periodicity?: 'monthly' | 'bimonthly' | 'quarterly' | 'biannual' | 'annual' | 'custom';
  lastModifiedBy?: string | User;
  createdBy?: string | User;
  createdAt: string;
  updatedAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "customers".
 */
export interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  phone?: string;
  roles?: 'student'[];
  email?: string;
  resetPasswordToken?: string;
  resetPasswordExpiration?: string;
  loginAttempts?: number;
  lockUntil?: string;
  createdAt: string;
  updatedAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "evaluations".
 */
export interface Evaluation {
  id: string;
  name: string;
  description: string;
  course?: string | Course;
  endDate: string;
  maxScore: number;
  lastModifiedBy?: string | User;
  createdBy?: string | User;
  createdAt: string;
  updatedAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "Exams".
 */
export interface Exam {
  id: string;
  content: {
    [k: string]: unknown;
  }[];
  evaluation?: string | Evaluation;
  questions: {
    multipleOptions?: 'verdadero' | 'falso';
    question?: string;
    options: {
      option?: string;
      correct?: 'verdadero' | 'falso';
      id?: string;
    }[];
    id?: string;
  }[];
  lastModifiedBy?: string | User;
  createdBy?: string | User;
  createdAt: string;
  updatedAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "homeworks".
 */
export interface Homework {
  id: string;
  content: {
    [k: string]: unknown;
  }[];
  evaluation?: string | Evaluation;
  lastModifiedBy?: string | User;
  createdBy?: string | User;
  createdAt: string;
  updatedAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "medias".
 */
export interface Media {
  id: string;
  altText: string;
  createdBy?: string | User;
  url?: string;
  filename: string;
  mimeType?: string;
  filesize?: number;
  width?: number;
  height?: number;
  sizes: {
    thumbnail: {
      url?: string;
      width?: number;
      height?: number;
      mimeType?: string;
      filesize?: number;
      filename?: string;
    };
    card: {
      url?: string;
      width?: number;
      height?: number;
      mimeType?: string;
      filesize?: number;
      filename?: string;
    };
    tablet: {
      url?: string;
      width?: number;
      height?: number;
      mimeType?: string;
      filesize?: number;
      filename?: string;
    };
  };
  createdAt: string;
  updatedAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "lessons".
 */
export interface Lesson {
  id: string;
  name: string;
  description: string;
  content: {
    [k: string]: unknown;
  }[];
  lastModifiedBy?: string | User;
  createdBy?: string | User;
  createdAt: string;
  updatedAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "pago-movils".
 */
export interface PagoMovil {
  id: string;
  phoneNumber: string;
  bank?:
    | 'banco-de-venezuela'
    | 'banco-mercantil'
    | 'banco-provincial'
    | 'banco-bicentenario'
    | 'banco-exterior'
    | 'banco-occidental-de-descuento'
    | 'banco-sofitasa'
    | 'banco-plaza'
    | 'banco-caroni'
    | 'banco-activo'
    | 'banco-del-tesoro'
    | 'banco-agricola-de-venezuela'
    | 'banco-de-la-fuerza-armada-nacional-bolivariana'
    | 'banco-del-pueblo-soberano'
    | 'banco-nacional-de-credito'
    | 'banco-venezolano-de-credito'
    | 'banesco';
  idn: number;
  createdAt: string;
  updatedAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "payment-methods".
 */
export interface PaymentMethod {
  id: string;
  paymentsOfUser?: string[] | User[];
  paymentMethodType?:
    | {
        value: string | Zelle;
        relationTo: 'zelles';
      }
    | {
        value: string | PagoMovil;
        relationTo: 'pago-movils';
      };
  createdBy?: string | User;
  createdAt: string;
  updatedAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "zelles".
 */
export interface Zelle {
  id: string;
  email: string;
  FullName: string;
  createdAt: string;
  updatedAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "subscriptions".
 */
export interface Subscription {
  id: string;
  status?: 'active' | 'inactive';
  startDate: string;
  endDate: string;
  enrollment?: string | Enrollment;
  periodicity?: 'monthly' | 'bimonthly' | 'quarterly' | 'biannual' | 'annual' | 'custom';
  order?: string | Order;
  createdAt: string;
  updatedAt: string;
}
