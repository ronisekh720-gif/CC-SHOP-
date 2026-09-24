import React, { useState } from 'react';
import { INITIAL_FAQS } from '../data/cardsData';
import {
  HelpCircle,
  MessageSquare,
  Send,
  ChevronDown,
  ChevronUp,
  Headphones,
  Sparkles,
  Bot,
  ExternalLink
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  time: string;
}

export const SupportView: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<string | null>('faq-1');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'bot',
      text: 'Hello! 👋 Welcome to CC SHOP ZONE Support. How can I assist you with your cards or delivery today?',
      time: 'Just now',
    },
  ]);
  const [inputVal, setInputVal] = useState('');

  const quickPrompts = [
    'How do I get my card token?',
    'Is this real money or demo?',
    'How do I check card status?',
    'How to check purchased goods?'
  ];

  const handleSendMessage = (textToSend?: string) => {
    const text = (textToSend || inputVal).trim();
    if (!text) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputVal('');

    // Generate intelligent demo response
    setTimeout(() => {
      let reply = 'Thank you for reaching out! In CC SHOP ZONE, all transactions are in Demo Mode for sandbox testing.';
      const lower = text.toLowerCase();

      if (lower.includes('token') || lower.includes('card') || lower.includes('cvv') || lower.includes('number')) {
        reply = '💳 Your card credentials (Card Number, Expiry, CVV, and PIN) are instantly generated and unlocked in the "Your Delivery" vault immediately after simulated payment!';
      } else if (lower.includes('money') || lower.includes('real') || lower.includes('cost') || lower.includes('price')) {
        reply = '🛡️ This is 100% demo software for UI/sandbox preview. No real funds or bank transactions are executed.';
      } else if (lower.includes('goods') || lower.includes('delivery') || lower.includes('check')) {
        reply = '📦 Tap the "Check Goods" button on the home screen or the DELIVERY tab at the bottom to view and copy all your active card tokens.';
      } else if (lower.includes('limit') || lower.includes('status')) {
        reply = '⚡ All cards are delivered in verified Active status ready for immediate use.';
      }

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: reply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMsg]);
    }, 600);
  };

  return (
    <div id="support-view-container" className="px-5 py-4 space-y-6">
      {/* Header Banner */}
      <div className="bg-[#101b29] border border-[#26364a] rounded-[22px] p-6 text-center shadow-xl">
        <div className="w-12 h-12 mx-auto rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white text-xl mb-2 shadow-md">
          <Headphones className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-white">24/7 Demo Help Desk</h2>
        <p className="text-xs text-gray-400 mt-1 max-w-xs mx-auto">
          Need assistance with demo checkout, delivery status, or card testing? We are here to help.
        </p>
      </div>

      {/* Interactive Chat Assistant */}
      <div className="bg-[#0e1824] border border-[#273d56] rounded-[22px] overflow-hidden shadow-2xl flex flex-col h-[340px]">
        <div className="bg-[#142335] px-4 py-3 border-b border-[#273d56] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-bold text-white flex items-center gap-1">
              <Bot className="w-3.5 h-3.5 text-amber-400" />
              <span>CC SHOP ZONE AI Assistant</span>
            </span>
          </div>
          <span className="text-[10px] text-emerald-400 font-mono">ONLINE</span>
        </div>

        {/* Message Log */}
        <div className="flex-1 p-3.5 overflow-y-auto space-y-2.5 bg-[#08101a]">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-3.5 py-2 text-xs leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-neutral-950 font-medium rounded-tr-xs'
                    : 'bg-[#152333] text-gray-200 border border-[#2c4059] rounded-tl-xs'
                }`}
              >
                <p>{m.text}</p>
                <span className="text-[9px] opacity-60 block text-right mt-1 font-mono">
                  {m.time}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Quick prompt suggestions */}
        <div className="px-3 py-1.5 bg-[#0b1420] border-t border-[#1e2f42] flex gap-1.5 overflow-x-auto no-scrollbar">
          {quickPrompts.map((q, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSendMessage(q)}
              className="whitespace-nowrap px-2.5 py-1 rounded-lg bg-[#142335] hover:bg-[#1d334d] border border-[#2d425c] text-[10px] text-gray-300 transition-colors cursor-pointer"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="p-2.5 bg-[#101b29] border-t border-[#273d56] flex gap-2"
        >
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="Type your question..."
            className="flex-1 bg-[#08101a] border border-[#25374d] rounded-xl px-3.5 py-2 text-xs text-white placeholder-gray-500 focus:outline-hidden focus:border-amber-400"
          />
          <button
            type="submit"
            className="p-2 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 text-neutral-950 font-bold hover:brightness-110 cursor-pointer shadow-md"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

      {/* Frequently Asked Questions */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
          <HelpCircle className="w-4 h-4 text-amber-400" />
          <span>Frequently Asked Questions</span>
        </h3>

        {INITIAL_FAQS.map((faq) => {
          const isOpen = openFaq === faq.id;
          return (
            <div
              key={faq.id}
              className="bg-[#101b29] border border-[#213144] rounded-[16px] overflow-hidden shadow-sm"
            >
              <button
                type="button"
                onClick={() => setOpenFaq(isOpen ? null : faq.id)}
                className="w-full text-left px-4 py-3.5 flex items-center justify-between text-xs font-bold text-white hover:text-amber-300 transition-colors cursor-pointer"
              >
                <span>{faq.question}</span>
                {isOpen ? (
                  <ChevronUp className="w-4 h-4 text-amber-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                )}
              </button>

              {isOpen && (
                <div className="px-4 pb-3.5 pt-1 text-xs text-gray-300 border-t border-gray-800/60 leading-relaxed animate-fade-in">
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
