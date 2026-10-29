import { createContext, useContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  deleteUser,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  verifyBeforeUpdateEmail,
} from "firebase/auth";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  query,
  setDoc,
  where,
  writeBatch,
} from "firebase/firestore";
import { auth, db } from "../firebase";

const AuthContext = createContext(null);

const messages = {
  "auth/email-already-in-use": "ეს ელფოსტა უკვე რეგისტრირებულია",
  "auth/invalid-credential": "ელფოსტა ან პაროლი არასწორია",
  "auth/invalid-email": "ელფოსტა არასწორია",
  "auth/weak-password": "პაროლი ძალიან სუსტია",
  "auth/too-many-requests": "ძალიან ბევრი მცდელობა, სცადეთ მოგვიანებით",
  "auth/network-request-failed": "ინტერნეტთან კავშირი ვერ მოხერხდა",
  "auth/requires-recent-login":
    "ამ მოქმედებისთვის საჭიროა ხელახლა შესვლა — გამოდით და შედით თავიდან",
};

function errorText(err) {
  return messages[err.code] || "დაფიქსირდა შეცდომა, სცადეთ თავიდან";
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let stopProfile = () => {};

    const stopAuth = onAuthStateChanged(auth, (fbUser) => {
      stopProfile();

      if (!fbUser) {
        setUser(null);
        setLoading(false);
        return;
      }

      stopProfile = onSnapshot(
        doc(db, "users", fbUser.uid),
        (snap) => {
          const data = snap.data() || {};
          setUser({
            id: fbUser.uid,
            email: fbUser.email,
            name: data.name || fbUser.email,
            avatar: data.avatar || null,
          });
          setLoading(false);
        },
        () => setLoading(false),
      );
    });

    return () => {
      stopProfile();
      stopAuth();
    };
  }, []);

  const register = async (name, email, password) => {
    try {
      const { user: fbUser } = await createUserWithEmailAndPassword(
        auth,
        email.trim().toLowerCase(),
        password,
      );
      await setDoc(doc(db, "users", fbUser.uid), {
        name: name.trim(),
        avatar: null,
      });
      return { ok: true };
    } catch (err) {
      return { ok: false, error: errorText(err) };
    }
  };

  const login = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email.trim().toLowerCase(), password);
      return { ok: true };
    } catch (err) {
      return { ok: false, error: errorText(err) };
    }
  };

  const logout = () => signOut(auth);

  const updateProfile = async (changes) => {
    const next = { ...changes };
    let emailSent = false;

    try {
      if (next.email !== undefined) {
        const mail = next.email.trim().toLowerCase();
        delete next.email;
        if (mail !== user.email) {
          await verifyBeforeUpdateEmail(auth.currentUser, mail);
          emailSent = true;
        }
      }
      if (next.name !== undefined) next.name = next.name.trim();

      await setDoc(doc(db, "users", user.id), next, { merge: true });
      return { ok: true, emailSent };
    } catch (err) {
      return { ok: false, error: errorText(err) };
    }
  };

  const deleteAccount = async () => {
    const lastLogin = Date.parse(auth.currentUser.metadata.lastSignInTime);
    if (Date.now() - lastLogin > 5 * 60 * 1000) {
      return { ok: false, error: messages["auth/requires-recent-login"] };
    }

    try {
      const mine = await getDocs(
        query(collection(db, "history"), where("userId", "==", user.id)),
      );
      const batch = writeBatch(db);
      mine.forEach((d) => batch.delete(d.ref));
      await batch.commit();
      await deleteDoc(doc(db, "users", user.id));
      await deleteUser(auth.currentUser);
      return { ok: true };
    } catch (err) {
      return { ok: false, error: errorText(err) };
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, register, login, logout, updateProfile, deleteAccount }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
