function Avatar({ user, size = 32 }) {
  const style = { width: size, height: size, fontSize: size * 0.4 };

  if (user.avatar) {
    return <img className="avatar" src={user.avatar} alt="" style={style} />;
  }

  const initials = user.name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  return (
    <span className="avatar" style={style} aria-hidden="true">
      {initials}
    </span>
  );
}

export default Avatar;
