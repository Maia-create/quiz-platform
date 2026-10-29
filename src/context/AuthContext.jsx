import { createContext, useContext } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";

const AuthContext = createContext(null);

async function hash(text) {
  const data = new TextEncoder().encode(text);
  const buffer = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export function AuthProvider({ children }) {
  const [users, setUsers] = useLocalStorage("users", []);
  const [user, setUser] = useLocalStorage("currentUser", null);

  const register = async (name, email, password) => {
    const mail = email.trim().toLowerCase();

    if (users.some((u) => u.email === mail)) {
      return { ok: false, error: "ეს ელფოსტა უკვე რეგისტრირებულია" };
    }

    const newUser = {
      id: Date.now(),
      name: name.trim(),
      email: mail,
      passwordHash: await hash(password),
    };

    setUsers([...users, newUser]);
    setUser({ id: newUser.id, name: newUser.name, email: newUser.email });
    return { ok: true };
  };

  const login = async (email, password) => {
    const mail = email.trim().toLowerCase();
    const found = users.find((u) => u.email === mail);

    if (!found || found.passwordHash !== (await hash(password))) {
      return { ok: false, error: "ელფოსტა ან პაროლი არასწორია" };
    }

    setUser({
      id: found.id,
      name: found.name,
      email: found.email,
      avatar: found.avatar || null,
    });
    return { ok: true };
  };

  const logout = () => setUser(null);

  const updateProfile = (changes) => {
    const next = { ...changes };

    if (next.name !== undefined) next.name = next.name.trim();
    if (next.email !== undefined) {
      next.email = next.email.trim().toLowerCase();
      if (users.some((u) => u.email === next.email && u.id !== user.id)) {
        return { ok: false, error: "ეს ელფოსტა უკვე რეგისტრირებულია" };
      }
    }

    setUsers(users.map((u) => (u.id === user.id ? { ...u, ...next } : u)));
    setUser({ ...user, ...next });
    return { ok: true };
  };

  const deleteAccount = () => {
    setUsers(users.filter((u) => u.id !== user.id));
    try {
      const history = JSON.parse(localStorage.getItem("history")) || [];
      localStorage.setItem(
        "history",
        JSON.stringify(history.filter((h) => h.userId !== user.id)),
      );
    } catch {
      // ისტორიის წაშლა ვერ მოხერხდა — ანგარიში მაინც იშლება
    }
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, register, login, logout, updateProfile, deleteAccount }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}