function ProgressBar({ current, total }) {
  const percent = ((current + 1) / total) * 100;

  return (
    <div className="progress">
      <div className="progress-fill" style={{ width: `${percent}%` }}></div>
    </div>
  );
}

export default ProgressBar;