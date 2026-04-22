'use client';
import { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, addDoc, getDocs, query, orderBy, deleteDoc, doc } from 'firebase/firestore';

export default function Home() {
  const [input, setInput] = useState('');
  const [category, setCategory] = useState('General'); 
  const [entries, setEntries] = useState<any[]>([]);

  const fetchEntries = async () => {
    const q = query(collection(db, 'vault_entries'), orderBy('timestamp', 'desc'));
    const querySnapshot = await getDocs(q);
    setEntries(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  useEffect(() => { fetchEntries(); }, []);

  const saveEntry = async () => {
    if (!input) return;
    await addDoc(collection(db, 'vault_entries'), {
      content: input,
      category: category, // Saving the category now
      timestamp: new Date()
    });
    setInput('');
    fetchEntries();
  };

  const deleteEntry = async (id: string) => {
    await deleteDoc(doc(db, 'vault_entries', id));
    fetchEntries();
  };

  return (
    <main className="p-10 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-5">Gemini Vault</h1>
      
      <div className="flex gap-2 mb-10 flex-col">
        <input 
          className="border p-2"
          value={input} 
          onChange={(e) => setInput(e.target.value)}
          placeholder="What are we working on?"
        />
        <div className="flex gap-2">
            <select className="border p-2 flex-grow" value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="General">General</option>
                <option value="Code">Code</option>
                <option value="Ideas">Ideas</option>
                <option value="Research">Research</option>
            </select>
            <button onClick={saveEntry} className="bg-blue-500 text-white p-2 px-6 rounded">Save</button>
        </div>
      </div>

      <div>
        {entries.map((entry: any) => (
          <div key={entry.id} className="border-b p-2 flex justify-between items-center">
            <div>
              <span className="text-xs font-bold text-gray-500 block uppercase">{entry.category || 'General'}</span>
              {entry.content}
            </div>
            <button onClick={() => deleteEntry(entry.id)} className="text-red-500 text-sm ml-4">Delete</button>
          </div>
        ))}
      </div>
    </main>
  );
}
