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

  const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://api-production-35ba.up.railway.app/api/v1';
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
    <div className="bg-brand-bg min-h-screen flex flex-col h-screen">
      {/* Header */}
      <div className="bg-brand-bg/90 backdrop-blur-md p-4 sticky top-0 z-30 border-b border-brand-border flex items-center shadow-lg">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-brand-text active:scale-90 transition-transform bg-brand-card hover:bg-brand-border rounded-full">
          <ArrowLeft className="w-6 h-6" />
        </button>
        
        <div className="ml-3 flex items-center flex-1">
          <div className="relative">
            <div className="w-10 h-10 bg-brand-primary text-black flex items-center justify-center font-black rounded-full shadow-lg">
              K
            </div>
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-brand-bg"></div>
          </div>
          <div className="ml-3">
            <h1 className="text-sm font-black text-brand-text leading-tight">Kun.uz Rasmiy</h1>
            <p className="text-[10px] text-green-500 font-bold tracking-wider">Online</p>
          </div>
        </div>

        <div className="flex items-center space-x-1">
          <button className="p-2 text-brand-muted hover:bg-brand-card rounded-full transition-colors"><Phone className="w-5 h-5"/></button>
          <button className="p-2 text-brand-muted hover:bg-brand-card rounded-full transition-colors"><MoreVertical className="w-5 h-5"/></button>
        </div>
      </div>

      {/* Notice panel regarding deal */}
      <div className="bg-amber-500/10 px-4 py-2 flex items-center justify-between text-xs border-b border-amber-500/20">
         <span className="font-bold text-amber-500">Deal: Instagram Post (150$)</span>
         <button className="text-amber-500 font-black border border-amber-500/30 px-2 py-1 rounded bg-amber-500/10 shadow-sm active:scale-95 transition-all">Tafsilotlar</button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-4">
        <div className="flex justify-center mb-6">
           <span className="text-[10px] font-bold text-brand-muted uppercase tracking-widest bg-brand-card px-3 py-1 rounded-full border border-brand-border">Bugun</span>
        </div>
        
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
            {msg.sender !== 'me' && (
              <div className="w-8 h-8 rounded-full bg-brand-primary text-black flex-shrink-0 flex items-center justify-center font-bold text-xs mr-2 mt-auto mb-1 shadow-lg shadow-brand-primary/20">
                K
              </div>
            )}
            <div className={`max-w-[75%] rounded-2xl px-4 py-3 shadow-md ${
              msg.sender === 'me' 
                ? 'bg-brand-primary text-black rounded-br-sm' 
                : 'bg-brand-card text-brand-text border border-brand-border rounded-bl-sm'
            }`}>
              <p className="text-[13px] leading-relaxed font-bold">{msg.content}</p>
              <div className={`text-[9px] font-bold mt-1 text-right ${msg.sender === 'me' ? 'text-black/60' : 'text-brand-muted/70'}`}>
                {msg.time}
              </div>
            </div>
          </div>
        ))}
        <div ref={endOfMessagesRef} />
      </div>

      {/* Input Area */}
      <div className="bg-brand-bg/90 backdrop-blur-md border-t border-brand-border p-3 pb-safe z-30 shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
        <div className="flex items-end bg-brand-card border border-brand-border rounded-[24px] p-1.5 focus-within:ring-2 focus-within:ring-brand-primary/50 transition-all shadow-inner">
           <button className="p-2.5 bg-brand-bg rounded-full text-brand-muted border border-brand-border shadow-md active:scale-95 transition-transform hover:bg-brand-border hover:text-brand-text">
             <Search className="w-5 h-5" />
           </button>
           <textarea 
             value={inputText}
             onChange={(e) => setInputText(e.target.value)}
             placeholder="Xabar yozing..."
             className="w-full bg-transparent max-h-32 resize-none outline-none text-sm font-medium py-3 px-3 overflow-y-auto placeholder:text-brand-muted text-brand-text"
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
                inputText.trim() ? 'bg-brand-primary text-black shadow-lg shadow-brand-primary/30 active:scale-95' : 'bg-transparent text-brand-muted/50'
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
