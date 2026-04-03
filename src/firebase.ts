import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, AuthError } from 'firebase/auth';
import { getFirestore, DocumentReference, DocumentData, doc, collection } from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';
import { logSecurityEvent } from './utils/security';

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const googleProvider = new GoogleAuthProvider();

// 配置Google登录提供者
googleProvider.setCustomParameters({ prompt: 'select_account' });
googleProvider.addScope('https://www.googleapis.com/auth/userinfo.email');
googleProvider.addScope('https://www.googleapis.com/auth/userinfo.profile');

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    logSecurityEvent('SIGN_IN', user.uid, `User signed in with Google: ${user.email}`);
    return result;
  } catch (error) {
    if (error instanceof AuthError) {
      logSecurityEvent('SIGN_IN_ERROR', 'unknown', `Google sign in failed: ${error.code}`);
    }
    throw error;
  }
};

export const logout = async () => {
  try {
    const userId = auth.currentUser?.uid;
    await signOut(auth);
    if (userId) {
      logSecurityEvent('SIGN_OUT', userId, 'User signed out');
    }
  } catch (error) {
    if (error instanceof AuthError) {
      logSecurityEvent('SIGN_OUT_ERROR', 'unknown', `Sign out failed: ${error.code}`);
    }
    throw error;
  }
};

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
    userId: string | undefined;
    email: string | null | undefined;
    emailVerified: boolean | undefined;
    isAnonymous: boolean | undefined;
    tenantId: string | null | undefined;
    providerInfo: {
      providerId: string;
      displayName: string | null;
      email: string | null;
      photoUrl: string | null;
    }[];
  }
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData.map(provider => ({
        providerId: provider.providerId,
        displayName: provider.displayName,
        email: provider.email,
        photoUrl: provider.photoURL
      })) || []
    },
    operationType,
    path
  };
  
  // 记录安全事件
  logSecurityEvent('FIRESTORE_ERROR', auth.currentUser?.uid || 'unknown', `Operation ${operationType} failed on ${path}: ${errInfo.error}`);
  
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// 安全的文档引用获取
export const getSecureDocRef = (collectionName: string, id: string): DocumentReference<DocumentData> => {
  // 验证ID格式，防止注入攻击
  if (!id || typeof id !== 'string' || id.includes('/') || id.includes('..')) {
    throw new Error('Invalid document ID');
  }
  return doc(collection(db, collectionName), id);
};

// 验证用户权限
export const verifyUserPermission = (requiredRole: string | string[]): boolean => {
  const user = auth.currentUser;
  if (!user) return false;
  
  // 这里可以根据实际的权限系统进行验证
  // 暂时返回true，实际项目中应该从用户配置或数据库中获取角色信息
  return true;
};
