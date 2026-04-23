'use client';
import { useState, useEffect } from 'react';
import { db, auth } from '../lib/firebase';
import { onAuthStateChanged, signOut, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { collection, addDoc, getDocs, query, orderBy, deleteDoc, doc, where } from 'firebase/firestore';
import NoteItem from '@/components/NoteItem';

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const [input, setInput] = useState('');
  const [category, setCategory] = useState('General');
  const [entries, setEntries] = useState<any[]>([]);

  const googleProvider = new GoogleAuthProvider();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) fetchEntries(currentUser.uid);
      else setEntries([]);
    });
    return () => unsubscribe();
  }, []);

  const handleGoogleSignIn = async () => await signInWithPopup(auth, googleProvider);

  const fetchEntries = async (uid: string) => {
    const q = query(collection(db, 'vault_entries'), where("userId", "==", uid), orderBy('timestamp', 'desc'));
    const querySnapshot = await getDocs(q);
    setEntries(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  const saveEntry = async () => {
    if (!input || !user) return;
    await addDoc(collection(db, 'vault_entries'), { content: input, category, timestamp: new Date(), userId: user.uid });
    setInput('');
    fetchEntries(user.uid);
  };

  const deleteEntry = async (id: string) => {
    await deleteDoc(doc(db, 'vault_entries', id));
    fetchEntries(user.uid);
  };

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <header className="flex justify-between items-center mb-10">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Gemini Vault</h1>
          {user && (
            <button onClick={() => signOut(auth)} className="text-sm text-gray-500 hover:text-red-600 transition">
              Sign out
            </button>
          )}
        </header>

        {!user ? (
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center">
            <h2 className="text-xl font-semibold mb-2">Welcome to your Vault</h2>
            <p className="text-gray-500 mb-6">Secure your thoughts with Google.</p>
            <button onClick={handleGoogleSignIn} className="bg-gray-900 text-white px-6 py-2.5 rounded-lg hover:bg-gray-800 transition shadow-md">
              Sign in with Google
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
              <textarea 
                className="w-full bg-gray-50 p-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none transition"
                rows={3}
                placeholder="What's on your mind?"
                value={input} 
                onChange={(e) => setInput(e.target.value)}
              />
              <div className="flex gap-3 mt-4">
                  <select className="bg-gray-50 border border-gray-300 px-4 py-2 rounded-lg text-sm text-gray-700" value={category} onChange={(e) => setCategory(e.target.value)}>
                    <option>General</option>
                    <option>Code</option>
                    <option>Ideas</option>
                    <option>Research</option>
                  </select>
                <button onClick={saveEntry} className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition ml-auto">
                  Save Note
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {entries.map((entry) => (
                <NoteItem key={entry.id} entry={entry} onDelete={deleteEntry} onUpdate={() => fetchEntries(user.uid)} />
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
