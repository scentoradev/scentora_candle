'use client';

type ConfirmDialogProps = {
  open: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function ConfirmDialog({
  open,
  title,
  message,
  confirmText = 'Xác nhận',
  cancelText = 'Hủy',
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/45 px-4">
      <div className="w-full max-w-md rounded-2xl border border-[#e5dccd] bg-white p-5 shadow-2xl">
        <h4 className="text-xl font-bold text-[#0B2D4D]">{title}</h4>
        <p className="mt-2 text-sm leading-6 text-[#475569]">{message}</p>
        <div className="mt-5 flex justify-end gap-2">
          <button onClick={onCancel} className="rounded-full border border-[#d8cdb9] px-4 py-2 text-sm font-semibold text-[#334155]">
            {cancelText}
          </button>
          <button onClick={onConfirm} className="rounded-full bg-[#0B2D4D] px-4 py-2 text-sm font-semibold text-white">
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
