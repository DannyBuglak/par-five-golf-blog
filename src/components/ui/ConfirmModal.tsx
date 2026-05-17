import "./ConfirmModal.css";

interface Props {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

function ConfirmModal({ message, onConfirm, onCancel }: Props) {
  return (
    <div className="modal__overlay" onClick={onCancel}>
      <div className="modal__box" onClick={(e) => e.stopPropagation()}>
        <p className="modal__message">{message}</p>
        <div className="modal__actions">
          <button className="modal__cancel" onClick={onCancel}>
            Cancel
          </button>
          <button className="modal__confirm" onClick={onConfirm}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;
