import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Avatar from "../components/Avatar";

// სურათს ვჭრით კვადრატად და ვამცირებთ, რომ localStorage-ში ცოტა ადგილი დაიკავოს
function resizeImage(file, max = 256) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();

    img.onload = () => {
      const side = Math.min(img.width, img.height);
      const size = Math.min(max, side);
      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      canvas
        .getContext("2d")
        .drawImage(
          img,
          (img.width - side) / 2,
          (img.height - side) / 2,
          side,
          side,
          0,
          0,
          size,
          size,
        );
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL("image/jpeg", 0.85));
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("bad image"));
    };
    img.src = url;
  });
}

function Profile() {
  const { user, updateProfile, deleteAccount, logout } = useAuth();
  const navigate = useNavigate();
  const fileRef = useRef(null);

  const [first, ...rest] = user.name.split(" ");
  const [form, setForm] = useState({
    firstName: first,
    lastName: rest.join(" "),
    email: user.email,
  });
  const [message, setMessage] = useState(null);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleFile = async (e) => {
    const file = e.target.files[0];
    e.target.value = "";
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setMessage({ ok: false, text: "აირჩიეთ სურათის ფაილი" });
      return;
    }

    try {
      const avatar = await resizeImage(file);
      updateProfile({ avatar });
      setMessage({ ok: true, text: "სურათი განახლდა" });
    } catch {
      setMessage({ ok: false, text: "სურათის ჩატვირთვა ვერ მოხერხდა" });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.firstName.trim() || !form.lastName.trim()) {
      setMessage({ ok: false, text: "შეავსეთ სახელი და გვარი" });
      return;
    }
    const result = updateProfile({
      name: `${form.firstName.trim()} ${form.lastName.trim()}`,
      email: form.email,
    });
    setMessage(
      result.ok
        ? { ok: true, text: "მონაცემები შენახულია" }
        : { ok: false, text: result.error },
    );
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleDelete = () => {
    if (!window.confirm("ნამდვილად გსურთ პროფილის წაშლა? ისტორიაც წაიშლება.")) {
      return;
    }
    deleteAccount();
    navigate("/");
  };

  // წინა გვერდზე დაბრუნება; თუ პროფილი პირდაპირ გაიხსნა — მთავარზე
  const handleClose = () => {
    if (window.history.state?.idx > 0) navigate(-1);
    else navigate("/");
  };

  return (
    <div>
      <button
        type="button"
        className="close-btn"
        onClick={handleClose}
        aria-label="დახურვა"
        title="დახურვა"
      >
        ✕
      </button>
      <h2>პროფილი</h2>

      <section className="profile-card">
        <div className="profile-avatar">
          <Avatar user={user} size={120} />
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            hidden
            onChange={handleFile}
          />
          <button
            type="button"
            className="btn-secondary"
            onClick={() => fileRef.current.click()}
          >
            სურათის ატვირთვა
          </button>
          {user.avatar && (
            <button
              type="button"
              className="btn-danger"
              onClick={() => {
                updateProfile({ avatar: null });
                setMessage({ ok: true, text: "სურათი წაიშალა" });
              }}
            >
              სურათის წაშლა
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="profile-form">
          <span className="field-label">სახელი</span>
          <input
            name="firstName"
            aria-label="სახელი"
            value={form.firstName}
            onChange={handleChange}
            required
          />
          <span className="field-label">გვარი</span>
          <input
            name="lastName"
            aria-label="გვარი"
            value={form.lastName}
            onChange={handleChange}
            required
          />
          <span className="field-label">ელფოსტა</span>
          <input
            name="email"
            type="email"
            aria-label="ელფოსტა"
            value={form.email}
            onChange={handleChange}
            required
          />
          {message && (
            <p className={message.ok ? "success" : "error"}>{message.text}</p>
          )}
          <button type="submit">შენახვა</button>
        </form>
      </section>

      <div className="actions">
        <button type="button" className="btn-secondary" onClick={handleLogout}>
          გასვლა
        </button>
        <button type="button" className="btn-danger" onClick={handleDelete}>
          პროფილის წაშლა
        </button>
      </div>
    </div>
  );
}

export default Profile;
