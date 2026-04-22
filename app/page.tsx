'use client';
import { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, addDoc, getDocs, query, orderBy } from 'firebase/firestore';

export default function Home() {
  const [input, setInput] = useState('');
  // CHANGE THIS LINE:
  const [entries, setEntries] = useState<any[]>([]); 

  // Fetch entries
  const fetchEntries = async () => {
    const q = query(collection(db, 'vault_entries'), orderBy('timestamp', 'desc'));
    const querySnapshot = await getDocs(q);
    setEntries(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  useEffect(() => { fetchEntries(); }, []);

  // Save entry
  const saveEntry = async () => {
    if (!input) return;
    await addDoc(collection(db, 'vault_entries'), {
      content: input,
      timestamp: new Date()
    });
    setInput('');
    fetchEntries(); 
  };

  return (
    <main className="p-10 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-5">Gemini Vault</h1>
      
      <div className="flex gap-2 mb-10">
        <input 
          className="border p-2 flex-grow"
          value={input} 
          onChange={(e) => setInput(e.target.value)}
          placeholder="What are we working on?"
        />
        <button onClick={saveEntry} className="bg-blue-500 text-white p-2 rounded">Save</button>
      </div>

      <div>
        {entries.map((entry: any) => (
          <div key={entry.id} className="border-b p-2">
            {entry.content}
          </div>
        ))}
      </div>
    </main>
  );
}
