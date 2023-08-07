/* tslint:disable */
/* eslint-disable */
/**
 * This file was automatically generated by Payload.
 * DO NOT MODIFY IT BY HAND. Instead, modify your source Payload config,
 * and re-run `payload generate:types` to regenerate this file.
 */

export interface Config {
  collections: {
    courses: Course;
    currencies: Currency;
    categories: Category;
    comments: Comment;
    enrollments: Enrollment;
    evaluations: Evaluation;
    medias: Media;
    lessons: Lesson;
    'payment-methods': PaymentMethod;
    plans: Plan;
    products: Product;
    reviews: Review;
    subscriptions: Subscription;
    orders: Order;
    users: User;
    examns: Examn;
    'examns-submissions': ExamnsSubmission;
  };
  globals: {
    'pago-movil': PagoMovil;
    zelle: Zelle;
  };
}
export interface Course {
  id: string;
  name: string;
  description: string;
  category: string[] | Category[];
  teacher?: string | User;
  lessons?: string[] | Lesson[];
  relatedCourses?: string[] | Course[];
  completedBy?: string[] | User[];
  createdBy?: string | User;
  lastModifiedBy?: string | User;
  isPublic?: boolean;
  slug?: string;
  updatedAt: string;
  createdAt: string;
}
export interface Category {
  id: string;
  name: string;
  description: string;
  image: string | Media;
  createdBy?: string | User;
  lastModifiedBy?: string | User;
  slug?: string;
  updatedAt: string;
  createdAt: string;
}
export interface Media {
  id: string;
  altText: string;
  createdBy?: string | User;
  lastModifiedBy?: string | User;
  slug?: string;
  updatedAt: string;
  createdAt: string;
  url?: string;
  filename: string;
  mimeType?: string;
  filesize?: number;
  width?: number;
  height?: number;
  sizes?: {
    thumbnail?: {
      url?: string;
      width?: number;
      height?: number;
      mimeType?: string;
      filesize?: number;
      filename?: string;
    };
    card?: {
      url?: string;
      width?: number;
      height?: number;
      mimeType?: string;
      filesize?: number;
      filename?: string;
    };
    tablet?: {
      url?: string;
      width?: number;
      height?: number;
      mimeType?: string;
      filesize?: number;
      filename?: string;
    };
  };
}
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  phone?: string;
  address?: string;
  birthDate?: string;
  gender?: 'male' | 'female' | 'other';
  roles?: ('admin' | 'teacher' | 'editor' | 'user')[];
  photo?: string | Media;
  sub?: string;
  googleId?: string;
  googleProfilePicture?: string;
  googleAccessToken?: string;
  slug?: string;
  updatedAt: string;
  createdAt: string;
  email: string;
  resetPasswordToken?: string;
  resetPasswordExpiration?: string;
  salt?: string;
  hash?: string;
  loginAttempts?: number;
  lockUntil?: string;
  password?: string;
}
export interface Lesson {
  id: string;
  name: string;
  description: string;
  category: string[] | Category[];
  teacher?: string | User;
  content: {
    [k: string]: unknown;
  }[];
  resources?: {
    name: string;
    description: {
      [k: string]: unknown;
    }[];
    id?: string;
  }[];
  completedBy?: string[] | User[];
  createdBy?: string | User;
  lastModifiedBy?: string | User;
  isPublic?: boolean;
  slug?: string;
  updatedAt: string;
  createdAt: string;
}
export interface Currency {
  id: string;
  name: string;
  symbol: string;
  exchangeRate: number;
  slug?: string;
  updatedAt: string;
  createdAt: string;
}
export interface Comment {
  id: string;
  comment: string;
  user?: string | User;
  likes?: number;
  dislikes?: number;
  commentable?:
    | {
        value: string | Product;
        relationTo: 'products';
      }
    | {
        value: string | Lesson;
        relationTo: 'lessons';
      }
    | {
        value: string | Course;
        relationTo: 'courses';
      }
    | {
        value: string | Comment;
        relationTo: 'comments';
      }
    | {
        value: string | Evaluation;
        relationTo: 'evaluations';
      };
  createdBy?: string | User;
  lastModifiedBy?: string | User;
  slug?: string;
  updatedAt: string;
  createdAt: string;
}
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
  info: {
    [k: string]: unknown;
  }[];
  lastModifiedBy?: string | User;
  createdBy?: string | User;
  slug?: string;
  updatedAt: string;
  createdAt: string;
}
export interface Plan {
  id: string;
  name: string;
  description: string;
  status?: 'active' | 'inactive';
  category: string[] | Category[];
  courses?: string[] | Course[];
  subscriptions?: string[] | Subscription[];
  periodicity?: 'monthly' | 'bimonthly' | 'quarterly' | 'biannual' | 'annual' | 'custom';
  lastModifiedBy?: string | User;
  createdBy?: string | User;
  slug?: string;
  updatedAt: string;
  createdAt: string;
}
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
  updatedAt: string;
  createdAt: string;
}
export interface Order {
  id: string;
  amount: number;
  status?: 'active' | 'inactive' | 'canceled' | 'pending' | 'finished' | 'refunded';
  type?: 'order' | 'renewal' | 'enrollment' | 'subscription';
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
  slug?: string;
  updatedAt: string;
  createdAt: string;
}
export interface PaymentMethod {
  id: string;
  paymentsOfUser?: string[] | User[];
  title: string;
  paymentMethodType: 'zelle' | 'paypal' | 'pagoMovil' | 'cash' | 'bankTransfer';
  zelle?: {
    zelleEmail?: string;
    zelleName?: string;
  };
  paypal?: {
    paypalEmail?: string;
  };
  pagoMovil?: {
    pagoMovilPhone: string;
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
    pagoMovilIdn: string;
  };
  cash?: {
    cash?: string;
  };
  bankTransfer?: {
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
  slug?: string;
  updatedAt: string;
  createdAt: string;
}
export interface Evaluation {
  id: string;
  name: string;
  description: string;
  course?: string | Course;
  endDate: string;
  maxScore: number;
  evaluationType: 'exam' | 'homework';
  homework?: {
    content: {
      [k: string]: unknown;
    }[];
    id?: string;
  }[];
  exam?: {
    content: {
      [k: string]: unknown;
    }[];
    formExamn: {
      form: string | Examn;
      id?: string;
      blockName?: string;
      blockType: 'formBlock';
    }[];
    timeToAnswer: number;
    id?: string;
  }[];
  completedBy?: string[] | User[];
  approvedBy?: string[] | User[];
  reprovedBy?: string[] | User[];
  lastModifiedBy?: string | User;
  createdBy?: string | User;
  slug?: string;
  updatedAt: string;
  createdAt: string;
}
export interface Examn {
  id: string;
  title: string;
  fields?: (
    | {
        name: string;
        label?: string;
        width?: number;
        defaultValue?: string;
        required?: boolean;
        id?: string;
        blockName?: string;
        blockType: 'text';
      }
    | {
        name: string;
        label?: string;
        width?: number;
        defaultValue?: string;
        required?: boolean;
        id?: string;
        blockName?: string;
        blockType: 'textarea';
      }
    | {
        name: string;
        label?: string;
        width?: number;
        defaultValue?: string;
        options?: {
          label: string;
          value: string;
          id?: string;
        }[];
        required?: boolean;
        id?: string;
        blockName?: string;
        blockType: 'select';
      }
    | {
        name: string;
        label?: string;
        width?: number;
        required?: boolean;
        id?: string;
        blockName?: string;
        blockType: 'email';
      }
    | {
        name: string;
        label?: string;
        width?: number;
        required?: boolean;
        id?: string;
        blockName?: string;
        blockType: 'state';
      }
    | {
        name: string;
        label?: string;
        width?: number;
        required?: boolean;
        id?: string;
        blockName?: string;
        blockType: 'country';
      }
    | {
        name: string;
        label?: string;
        width?: number;
        defaultValue?: number;
        required?: boolean;
        id?: string;
        blockName?: string;
        blockType: 'number';
      }
    | {
        name: string;
        label?: string;
        width?: number;
        required?: boolean;
        defaultValue?: boolean;
        id?: string;
        blockName?: string;
        blockType: 'checkbox';
      }
    | {
        message?: {
          [k: string]: unknown;
        }[];
        id?: string;
        blockName?: string;
        blockType: 'message';
      }
  )[];
  submitButtonLabel?: string;
  confirmationType?: 'message' | 'redirect';
  confirmationMessage: {
    [k: string]: unknown;
  }[];
  redirect?: {
    url: string;
  };
  emails?: {
    emailTo?: string;
    cc?: string;
    bcc?: string;
    replyTo?: string;
    emailFrom?: string;
    subject: string;
    message?: {
      [k: string]: unknown;
    }[];
    id?: string;
  }[];
  updatedAt: string;
  createdAt: string;
}
export interface Enrollment {
  id: string;
  student?: string | User;
  products?: string | Product;
  course?: string | Course;
  status?: 'active' | 'inactive';
  order?: string | Order;
  updatedAt: string;
  createdAt: string;
}
export interface Review {
  id: string;
  review?: string;
  likes?: number;
  dislikes?: number;
  reviewable?:
    | {
        value: string | Product;
        relationTo: 'products';
      }
    | {
        value: string | Lesson;
        relationTo: 'lessons';
      }
    | {
        value: string | Course;
        relationTo: 'courses';
      }
    | {
        value: string | Comment;
        relationTo: 'comments';
      }
    | {
        value: string | Evaluation;
        relationTo: 'evaluations';
      };
  rating?: '1' | '1.5' | '2' | '2.5' | '3' | '3.5' | '4' | '4.5' | '5';
  createdBy?: string | User;
  lastModifiedBy?: string | User;
  slug?: string;
  updatedAt: string;
  createdAt: string;
}
export interface ExamnsSubmission {
  id: string;
  form: string | Examn;
  submissionData?: {
    field: string;
    value: string;
    id?: string;
  }[];
  evaluation?: string | Evaluation;
  score?: number;
  teacherComments?: {
    [k: string]: unknown;
  }[];
  approved: 'approved' | 'rejected' | 'pending';
  createdBy?: string | User;
  lastModifiedBy?: string | User;
  updatedAt: string;
  createdAt: string;
}
export interface PagoMovil {
  id: string;
  phone: string;
  name: string;
  cid: string;
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
  updatedAt?: string;
  createdAt?: string;
}
export interface Zelle {
  id: string;
  email: string;
  zelleHolder: string;
  bank: string;
  updatedAt?: string;
  createdAt?: string;
}
