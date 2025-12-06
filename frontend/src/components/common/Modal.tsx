import React from "react";

type Props = { open: boolean; onClose: () => void; children: React.ReactNode };

export default function Modal({ open, onClose, children }: Props) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-white rounded p-4 min-w-[300px]">
        <button className="absolute top-2 right-2" onClick={onClose}>×</button>
        {children}
      </div>
    </div>
  );
}
