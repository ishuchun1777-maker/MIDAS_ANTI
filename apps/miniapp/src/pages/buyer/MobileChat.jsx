import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { chatApi } from '../../api.js';

export default function MobileChat() {
  const navigate = useNavigate();
  const { roomId } = useParams();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);
  const bottomRef = useRef(null);

  useEffect(() => { load(); }, [roomId]);

  const load = async () => {
    try {
      const data = await chatApi.getMessages(roomId);
      setMessages(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const send = async () => {
    if (!text.trim()) return;
    const t = text;
    setText('');
    try {
      await chatApi.sendMessage(roomId, t);
      load();
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="h-screen bg-[#0a0a0a] text-white flex flex-col">
      <div className="px-4 py-4 border-b border-white/10 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="text-gray-400">←</button>
        <h1 className="font-black text-base">Chat</h1>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {loading && (
          <div className="flex justify-center pt-10">
            <div className="w-6 h-6 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" />
          </div>
        )}
        {messages.map(msg => (
          <div key={msg.id} className="bg-white/5 border border-white/10 rounded-2xl px-4 py-3 max-w-[85%]">
            <p className="text-sm">{msg.text}</p>
            <p className="text-gray-600 text-xs mt-1">
              {new Date(msg.created_at).toLocaleTimeString('uz', { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <div className="px-4 py-4 border-t border-white/10 flex gap-2">
        <input
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && send()}
          placeholder="Xabar yozing..."
          className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-yellow-400"
        />
        <button
          onClick={send}
          className="bg-yellow-400 text-black font-bold px-4 rounded-xl active:scale-95"
        >
          →
        </button>
      </div>
    </div>
  );
}
