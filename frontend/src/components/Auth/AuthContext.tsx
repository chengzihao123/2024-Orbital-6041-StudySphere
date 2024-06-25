import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  signInWithPopup,
  GoogleAuthProvider,
  User,
  UserCredential,
  updateProfile,
} from "firebase/auth";
import { auth, firestore } from "../../../firebase/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";

type AuthContextType = {
  currentUser: User | null;
  profile: { displayName: string; photoURL: string };
  signup: (
    email: string,
    password: string,
    displayName: string,
    photoURL: string
  ) => Promise<UserCredential>;
  login: (email: string, password: string) => Promise<UserCredential>;
  logout: () => Promise<void>;
  loginWithGoogle: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  return useContext(AuthContext);
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState({ displayName: "", photoURL: "" });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      setLoading(false);
      if (user) {
        const userDoc = await getDoc(doc(firestore, "users", user.uid));
        if (userDoc.exists()) {
          setProfile(userDoc.data() as { displayName: string; photoURL: string });
        } else {
          setProfile({
            displayName: user.displayName || "",
            photoURL: user.photoURL || "",
          });
        }
      } else {
        setProfile({ displayName: "", photoURL: "" });
      }
    });

    return () => unsubscribe();
  }, []);

  const signup = async (
    email: string,
    password: string,
    displayName: string,
    photoURL: string
  ): Promise<UserCredential> => {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;
    await updateProfile(user, { displayName, photoURL });

    await setDoc(doc(firestore, "users", user.uid), {
      displayName,
      photoURL,
      email,
    });

    setProfile({ displayName, photoURL });

    return userCredential;
  };

  const login = (email: string, password: string): Promise<UserCredential> => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const logout = (): Promise<void> => {
    setCurrentUser(null);
    setProfile({ displayName: "", photoURL: "" });
    return signOut(auth);
  };

  const loginWithGoogle = async (): Promise<void> => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      await setDoc(doc(firestore, "users", user.uid), {
        displayName: user.displayName,
        photoURL: user.photoURL,
        email: user.email,
      });

      setCurrentUser(user);
      setProfile({
        displayName: user.displayName || "",
        photoURL: user.photoURL || "",
      });
    } catch (error) {
      console.error("Failed to log in with Google", error);
    }
  };

  const value: AuthContextType = {
    currentUser,
    profile,
    signup,
    login,
    logout,
    loginWithGoogle,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
