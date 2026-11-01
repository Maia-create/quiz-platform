import { useEffect, useRef } from "react";

function ConfirmDialog({ open, title, text, confirmText, onConfirm, onCancel }) {
  const ref = useRef(null);

  useEffect(() => {
    const dialog = ref.current;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      className="confirm-card"
      onCancel={(e) => {
        e.preventDefault();
        onCancel();
      }}
      onClick={(e) => {
        if (e.target === ref.current) onCancel();
      }}
    >
      <button
        type="button"
        className="close-btn"
        onClick={onCancel}
        aria-label="დახურვა"
        title="დახურვა"
      >
        ✕
      </button>
      <div className="confirm-body">
        <h3>{title}</h3>
        <p>{text}</p>
        <div className="actions">
          <button type="button" className="btn-secondary" onClick={onCancel}>
            გაუქმება
          </button>
          <button type="button" className="btn-danger" onClick={onConfirm}>
            {confirmText}
          </button>
        </div>
      </div>
    </dialog>
  );
}

export default ConfirmDialog;
