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
  category?: string[] | Category[];
  teacher?: string | User;
  lessons?: string[] | Lesson[];
  reviews?: string[] | Review[];
  relatedCourses?: string[] | Course[];
  createdBy?: string | User;
  lastModifiedBy?: string | User;
  isPublic?: boolean;
  createdAt: string;
  updatedAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "categories".
 */
export interface Category {
  id: string;
  name: string;
  description: string;
  image: string | Media;
  createdBy?: string | User;
  lastModifiedBy?: string | User;
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
  lastModifiedBy?: string | User;
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
 * via the `definition` "users".
 */
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  phone?: string;
  address?: string;
  birthDate?: string;
  gender?: 'male' | 'female' | 'other';
  profilePicture?: string | Media;
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
 * via the `definition` "lessons".
 */
export interface Lesson {
  id: string;
  name: string;
  description: string;
  category?: string[] | Category[];
  teacher?: string | User;
  content: {
    [k: string]: unknown;
  }[];
  resources: {
    name: string;
    description: {
      [k: string]: unknown;
    }[];
    id?: string;
  }[];
  comments?: string[] | Comment[];
  createdBy?: string | User;
  lastModifiedBy?: string | User;
  isPublic?: boolean;
  createdAt: string;
  updatedAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "comments".
 */
export interface Comment {
  id: string;
  comment?: string;
  user?: string | User;
  likes?: number;
  dislikes?: number;
  lesson?: string | Lesson;
  replyTo?: string[] | Comment[];
  createdBy?: string | User;
  lastModifiedBy?: string | User;
  createdAt: string;
  updatedAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "reviews".
 */
export interface Review {
  id: string;
  review?: string;
  user?: string | User;
  likes?: number;
  dislikes?: number;
  createdBy?: string | User;
  lastModifiedBy?: string | User;
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
 * via the `definition` "enrollments".
 */
export interface Enrollment {
  id: string;
  student?: string | User;
  products?: string | Product;
  course?: string | Course;
  status?: 'active' | 'inactive';
  order?: string | Order;
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
  productType?:
    | {
        value: string | Course;
        relationTo: 'courses';
      }
    | {
        value: string | Plan;
        relationTo: 'plans';
      };
  productStatus: 'active' | 'inactive';
  productPrice: {
    price: number;
    aceptedCurrency: 'Bs.' | 'USD';
    id?: string;
  }[];
  productImage: string | Media;
  relatedProducts?: string[] | Product[];
  reviews?: string[] | Review[];
  lastModifiedBy?: string | User;
  createdBy?: string | User;
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
  category?: string[] | Category[];
  courses?: string[] | Course[];
  subscriptions?: string[] | Subscription[];
  reviews?: string[] | Review[];
  periodicity?: 'monthly' | 'bimonthly' | 'quarterly' | 'biannual' | 'annual' | 'custom';
  lastModifiedBy?: string | User;
  createdBy?: string | User;
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
  user?: string | User;
  product?: string | Product;
  plan?: string | Plan;
  periodicity?: 'monthly' | 'bimonthly' | 'quarterly' | 'biannual' | 'annual' | 'custom';
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
  status?: 'active' | 'inactive' | 'canceled' | 'pending';
  type?: 'order' | 'renewal' | 'enrollment';
  customer?: string | User;
  products?: string[] | Product[];
  referenceNumber?: string;
  paymentMethod?: string | PaymentMethod;
  details?: {
    [k: string]: unknown;
  }[];
  total?: string;
  createdBy?: string | User;
  lastModifiedBy?: string | User;
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
  title: string;
  paymentMethodType: 'zelle' | 'paypal' | 'pago-movil' | 'cash' | 'bank-transfer';
  zelle: {
    zelleEmail?: string;
    fullName?: string;
  };
  paypal: {
    paypalEmail?: string;
  };
  pagoMovil: {
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
  };
  cash: {
    cash?: string;
  };
  bankTransfer: {
    accountNumber?: string;
    bankName?: string;
    accountType?: 'savings' | 'current';
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
  };
  createdBy?: string | User;
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
  evaluationType: 'exam' | 'homework';
  homework: {
    content: {
      [k: string]: unknown;
    }[];
    id?: string;
  }[];
  exam: {
    content: {
      [k: string]: unknown;
    }[];
    questions: {
      question: {
        [k: string]: unknown;
      }[];
      id?: string;
    }[];
    id?: string;
  }[];
  lastModifiedBy?: string | User;
  createdBy?: string | User;
  createdAt: string;
  updatedAt: string;
}
