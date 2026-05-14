import { Timestamp } from 'firebase/firestore';

export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  photoURL?: string;
  createdAt: Timestamp;
}

export interface AgendaEvent {
  id: string;
  userId: string;
  title: string;
  description?: string;
  start: Timestamp;
  end: Timestamp;
  location?: string;
  category?: string;
  createdAt: Timestamp;
  updatedAt?: Timestamp;
}

export interface AgendaTask {
  id: string;
  userId: string;
  title: string;
  description?: string;
  completed: boolean;
  dueDate?: Timestamp;
  priority?: 'low' | 'medium' | 'high';
  createdAt: Timestamp;
  updatedAt?: Timestamp;
}

export interface AgendaNote {
  id: string;
  userId: string;
  title: string;
  content: string;
  createdAt: Timestamp;
  updatedAt?: Timestamp;
}

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
  };
}
