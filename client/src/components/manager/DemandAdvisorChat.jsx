import React, { useState } from 'react';
import { Send, Sparkles, Bot, User, Loader2 } from 'lucide-react';
import { api } from '../../services/api';

export function DemandAdvisorChat({ storeId }) {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `Hello Store Manager. I am your Walmart StockSense Real-Time Inventory & Demand Advisor. Ask me anything about today's orders, store inventory levels, or when demand will be increasing for your store.`
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const quickPrompts = [
    "What are today's orders and inventory levels?",
    "When will demand be increasing for key SKUs?",
    "Which items need emergency reordering today?"
  ];

  const handleSend = async (questionText) => {
    const q = questionText || input;
    if (!q.trim() || loading) return;

    const newMsgs = [...messages, { role: 'user', content: q }];
    setMessages(newMsgs);
    setInput('');
    setLoading(true);

    try {
      const res = await api.manager.chatWithAgent(storeId, q);
      setMessages([...newMsgs, { role: 'assistant', content: res.answer || 'Response generated.' }]);
    } catch (err) {
      setMessages([
        ...newMsgs,
        {
          role: 'assistant',
          content: 'Apologies, I encountered an issue reaching the AI chat service. Please verify the API key in your server environment.'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#FCF8EE] rounded-3xl border border-[#EBDDC6] p-5 sm:p-6 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#EBDDC6]">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-[#005CE6] text-white flex items-center justify-center">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-black text-slate-900">
              Demand & Inventory Advisor
            </h3>
            <span className="text-[10px] text-slate-500 font-bold uppercase">
              API Powered • Store {storeId} Live Orders & Demand
            </span>
          </div>
        </div>

        <span className="inline-flex items-center gap-1 text-[11px] font-black text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-full border border-emerald-300">
          <Sparkles className="w-3 h-3 text-emerald-600" />
          AI Chat Connected
        </span>
      </div>

      {/* Quick Prompt Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {quickPrompts.map((p, i) => (
          <button
            key={i}
            onClick={() => handleSend(p)}
            className="text-[11px] font-bold bg-[#F6EEDB] hover:bg-[#EFE4CF] text-slate-700 px-3 py-1.5 rounded-xl border border-[#EBDDC6] shrink-0 transition-colors cursor-pointer"
          >
            {p}
          </button>
        ))}
      </div>

      {/* Message History */}
      <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex gap-3 text-xs leading-relaxed ${
              m.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {m.role === 'assistant' && (
              <div className="w-7 h-7 rounded-lg bg-[#005CE6] text-white flex items-center justify-center shrink-0 mt-0.5">
                <Bot className="w-3.5 h-3.5" />
              </div>
            )}

            <div
              className={`p-3.5 rounded-2xl max-w-[85%] whitespace-pre-line ${
                m.role === 'user'
                  ? 'bg-slate-900 text-white font-medium rounded-tr-xs'
                  : 'bg-[#F6EEDB] text-slate-900 font-normal border border-[#EBDDC6] rounded-tl-xs'
              }`}
            >
              {m.content}
            </div>

            {m.role === 'user' && (
              <div className="w-7 h-7 rounded-lg bg-[#EA7A18] text-white flex items-center justify-center shrink-0 mt-0.5">
                <User className="w-3.5 h-3.5" />
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex gap-3 text-xs items-center text-slate-500">
            <div className="w-7 h-7 rounded-lg bg-[#005CE6] text-white flex items-center justify-center shrink-0">
              <Bot className="w-3.5 h-3.5" />
            </div>
            <div className="bg-[#F6EEDB] p-3 rounded-2xl border border-[#EBDDC6] flex items-center gap-2">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-[#005CE6]" />
              <span className="font-semibold text-slate-700">Analyzing live orders & demand signals...</span>
            </div>
          </div>
        )}
      </div>

      {/* Input Box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="flex items-center gap-2 pt-2 border-t border-[#EBDDC6]"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`Ask about today's orders, store inventory, or increasing demand for ${storeId}...`}
          className="flex-1 bg-[#F6EEDB] border border-[#EBDDC6] rounded-xl px-3.5 py-2 text-xs text-slate-900 font-medium focus:outline-none focus:border-[#005CE6]"
        />
        <button
          type="submit"
          disabled={!input.trim() || loading}
          className="bg-[#005CE6] hover:bg-[#004BB8] disabled:opacity-40 text-white font-bold px-3.5 py-2 rounded-xl transition-colors cursor-pointer"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
}
