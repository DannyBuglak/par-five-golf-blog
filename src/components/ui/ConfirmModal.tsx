import "./ConfirmModal.css";

interface Props {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
  confirmVariant?: "danger" | "primary";
}

function ConfirmModal({
  message,
  onConfirm,
  onCancel,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  confirmVariant = "danger",
}: Props) {
  return (
    <div className="modal__overlay" onClick={onCancel}>
      <div className="modal__box" onClick={(e) => e.stopPropagation()}>
        <p className="modal__message">{message}</p>
        <div className="modal__actions">
          <button className="modal__cancel" onClick={onCancel}>
            {cancelLabel}
          </button>
          <button
            className={`modal__confirm modal__confirm--${confirmVariant}`}
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;