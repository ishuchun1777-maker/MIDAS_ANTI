import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Send, Search, VerifiedIcon, MoreVertical, Phone, Video } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';

const MobileChat = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(true);
  const endOfMessagesRef = useRef(null);

  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';
  const token = localStorage.getItem('token');
  const myId = token ? JSON.parse(atob(token.split('.')[1]))?.sub : null;

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/chats/${id}/history`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          const mapped = data.map(m => ({
            id: m.id,
            sender: m.sender_id === myId ? 'me' : 'them',
            content: m.content,
            time: new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }));
          setMessages(mapped);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
    
    // In Sprint 8/Final: Setup WebSocket here
  }, [id, token, myId]);

  // Scroll to bottom every time messages change
  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!inputText.trim()) return;
    
    const textToSend = inputText;
    setInputText('');
    
    try {
      const res = await fetch(`${API_BASE_URL}/chats/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ content: textToSend })
      });
      if (res.ok) {
        const m = await res.json();
        setMessages(prev => [...prev, {
            id: m.id,
            sender: 'me',
            content: m.content,
            time: new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="bg-[#fcfcfd] min-h-screen flex flex-col h-screen">
      {/* Header */}
      <div className="bg-white/95 backdrop-blur-md p-4 sticky top-0 z-30 border-b border-gray-100 flex items-center shadow-sm">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-gray-900 active:scale-90 transition-transform bg-gray-50 hover:bg-gray-100 rounded-full">
          <ArrowLeft className="w-6 h-6" />
        </button>
        
        <div className="ml-3 flex items-center flex-1">
          <div className="relative">
            <div className="w-10 h-10 bg-gradient-to-tr from-accent to-accent-hover text-white flex items-center justify-center font-bold rounded-full">
              K
            </div>
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
          </div>
          <div className="ml-3">
            <h1 className="text-sm font-black text-gray-900 leading-tight">Kun.uz Rasmiy</h1>
            <p className="text-[10px] text-green-600 font-bold tracking-wider">Online</p>
          </div>
        </div>

        <div className="flex items-center space-x-1">
          <button className="p-2 text-gray-500 hover:bg-gray-50 rounded-full"><Phone className="w-5 h-5"/></button>
          <button className="p-2 text-gray-500 hover:bg-gray-50 rounded-full"><MoreVertical className="w-5 h-5"/></button>
        </div>
      </div>

      {/* Notice panel regarding deal */}
      <div className="bg-amber-50 px-4 py-2 flex items-center justify-between text-xs border-b border-amber-100">
         <span className="font-bold text-amber-800">Deal: Instagram Post (150$)</span>
         <button className="text-amber-600 font-black border border-amber-200 px-2 py-1 rounded bg-white shadow-sm">Tafsilotlar</button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-4">
        <div className="flex justify-center mb-6">
           <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-gray-100 px-3 py-1 rounded-full">Bugun</span>
        </div>
        
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
            {msg.sender !== 'me' && (
              <div className="w-8 h-8 rounded-full bg-accent text-white flex-shrink-0 flex items-center justify-center font-bold text-xs mr-2 mt-auto mb-1">
                K
              </div>
            )}
            <div className={`max-w-[75%] rounded-2xl px-4 py-3 shadow-sm ${
              msg.sender === 'me' 
                ? 'bg-accent text-white rounded-br-sm' 
                : 'bg-white text-gray-900 border border-gray-100 rounded-bl-sm'
            }`}>
              <p className="text-[13px] leading-relaxed font-medium">{msg.content}</p>
              <div className={`text-[9px] font-bold mt-1 text-right ${msg.sender === 'me' ? 'text-white/70' : 'text-gray-400'}`}>
                {msg.time}
              </div>
            </div>
          </div>
        ))}
        <div ref={endOfMessagesRef} />
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-gray-100 p-3 pb-safe z-30">
        <div className="flex items-end bg-gray-50 border border-gray-200 rounded-[24px] p-1.5 focus-within:ring-2 focus-within:ring-accent/20 transition-all">
           <button className="p-2.5 bg-white rounded-full text-gray-400 shadow-sm active:scale-95 transition-transform">
             <Search className="w-5 h-5" />
           </button>
           <textarea 
             value={inputText}
             onChange={(e) => setInputText(e.target.value)}
             placeholder="Xabar yozing..."
             className="w-full bg-transparent max-h-32 resize-none outline-none text-sm font-medium py-3 px-3 overflow-y-auto placeholder:text-gray-400"
             rows={1}
             onKeyDown={(e) => {
               if(e.key === 'Enter' && !e.shiftKey) {
                 e.preventDefault();
                 handleSend();
               }
             }}
           />
           <button 
              onClick={handleSend}
              disabled={!inputText.trim()}
              className={`p-3 rounded-full flex items-center justify-center transition-all ${
                inputText.trim() ? 'bg-accent text-white shadow-lg active:scale-95' : 'bg-transparent text-gray-300'
              }`}
            >
             <Send className={`w-5 h-5 ${inputText.trim() ? 'ml-0.5' : ''}`} />
           </button>
        </div>
      </div>
    </div>
  );
};

export default MobileChat;
