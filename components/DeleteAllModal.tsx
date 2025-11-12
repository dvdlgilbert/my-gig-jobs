import React from 'react';

interface DeleteAllModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const DeleteAllModal: React.FC<DeleteAllModalProps> = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-2xl max-w-md w-full" onClick={e => e.stopPropagation()}>
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Delete All Gig Data?</h2>
          <div className="space-y-4 text-gray-600 text-sm">
            <p className="font-semibold text-red-600">Are you sure you want to delete ALL gig data?</p>
            <p>This action cannot be undone. Consider using 'Export Gigs' first as a backup.</p>
          </div>
        </div>
        <div className="bg-gray-100 p-4 flex justify-end items-center gap-3">
          <button onClick={onClose} className="text-sm bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 font-medium">
            Cancel
          </button>
          <button onClick={onConfirm} className="text-sm bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 font-bold">
            DELETE ALL
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteAllModal;
