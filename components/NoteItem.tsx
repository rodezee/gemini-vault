// components/NoteItem.tsx
import { useState } from "react";

export default function NoteItem({ entry, onDelete }: { entry: any, onDelete: (id: string) => void }) {
  const [loading, setLoading] = useState(false);
  const [aiResult, setAiResult] = useState("");

  const enhanceEntry = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: `Analyze this note and suggest 3 sub-tasks: "${entry.content}"` }),
      });
      const data = await response.json();
      setAiResult(data.text);
    } catch (e) {
      alert("Error generating suggestion");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border-b p-4 my-2 bg-gray-900 rounded-lg">
      <div className="flex justify-between items-start">
        <div>
          <span className="text-xs font-bold text-gray-500 block uppercase">{entry.category || 'General'}</span>
          <p className="text-white">{entry.content}</p>
        </div>
        <div className="flex gap-2">
            {!aiResult && (
                <button 
                onClick={enhanceEntry} 
                disabled={loading}
                className="text-blue-400 text-sm border border-blue-500/30 px-2 py-1 rounded hover:bg-blue-900/20 flex items-center"
                >
                {loading ? (
                    // The SVG Spinner
                    <svg className="animate-spin h-4 w-4 text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                    </svg>
                ) : "✨ Enhance"}
                </button>
            )}
            <button onClick={() => onDelete(entry.id)} className="text-red-500 text-sm p-1">Delete</button>
        </div>
      </div>

      {/* Inline AI Result */}
      {aiResult && (
        <div className="mt-4 p-3 bg-blue-900/20 border border-blue-500/30 rounded text-blue-100 text-sm">
          <h4 className="font-bold mb-1 text-blue-300">AI Suggestion:</h4>
          <p className="whitespace-pre-wrap">{aiResult}</p>
          <button onClick={() => setAiResult("")} className="mt-2 text-xs text-blue-400 underline">Close</button>
        </div>
      )}
    </div>
  );
}
