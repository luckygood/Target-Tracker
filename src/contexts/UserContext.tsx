import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { auth, db, signInWithGoogle, logout, handleFirestoreError, OperationType } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { UserProfile, UserRole } from '../types';

interface UserContextType {
  userProfile: UserProfile | null;
  isAuthReady: boolean;
  isFA: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
  setUserRole: (role: UserRole) => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);

  // Auth Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDocRef = doc(db, 'users', user.uid);
        try {
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            const profile = userDoc.data() as UserProfile;
            setUserProfile(profile);
          } else {
            // Create default profile
            const newProfile: UserProfile = {
              uid: user.uid,
              email: user.email || '',
              role: user.email === 'parrotandy@gmail.com' ? 'fa_admin' : 'client_user',
              displayName: user.displayName || '',
              photoURL: user.photoURL || ''
            };
            await setDoc(userDocRef, newProfile);
            setUserProfile(newProfile);
          }
        } catch (error) {
          handleFirestoreError(error, OperationType.GET, `users/${user.uid}`);
        }
      } else {
        setUserProfile(null);
      }
      setIsAuthReady(true);
    });
    return () => unsubscribe();
  }, []);

  const signIn = async () => {
    await signInWithGoogle();
  };

  const signOut = async () => {
    await logout();
  };

  const setUserRole = async (role: UserRole) => {
    if (!userProfile) return;
    const userDocRef = doc(db, 'users', userProfile.uid);
    try {
      await setDoc(userDocRef, { ...userProfile, role }, { merge: true });
      setUserProfile({ ...userProfile, role });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `users/${userProfile.uid}`);
    }
  };

  const isFA = userProfile?.role === 'fa_admin' || userProfile?.role === 'fa_member';

  const value = {
    userProfile,
    isAuthReady,
    isFA,
    signIn,
    signOut,
    setUserRole
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};