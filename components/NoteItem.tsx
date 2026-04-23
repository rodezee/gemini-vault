'use client';
import { useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../lib/firebase";

export default function NoteItem({ entry, onDelete, onUpdate }: any) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(entry.content);

  const handleUpdate = async () => {
    await updateDoc(doc(db, 'vault_entries', entry.id), { content: editText });
    setIsEditing(false);
    onUpdate();
  };

  return (
    <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition duration-200">
      <div className="flex justify-between items-start mb-3">
        <span className="px-2 py-1 bg-blue-50 text-blue-700 text-[10px] font-bold uppercase tracking-wider rounded-md">
          {entry.category}
        </span>
        <div className="flex gap-2">
          {isEditing ? (
            <button onClick={handleUpdate} className="text-xs text-green-600 font-semibold hover:underline">Save</button>
          ) : (
            <button onClick={() => setIsEditing(true)} className="text-xs text-gray-400 hover:text-blue-600">Edit</button>
          )}
          <button onClick={() => onDelete(entry.id)} className="text-xs text-gray-400 hover:text-red-600">Delete</button>
        </div>
      </div>

      {isEditing ? (
        <textarea 
          className="w-full bg-gray-50 p-3 rounded-lg text-sm text-gray-800 border focus:border-blue-300 outline-none"
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
        />
      ) : (
        <p className="text-gray-700 text-sm leading-relaxed">{entry.content}</p>
      )}
    </div>
  );
}
