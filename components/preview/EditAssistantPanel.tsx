'use client';

import React, { useState } from 'react';
import { Send, Sparkles, Check, RotateCcw, AlertCircle } from 'lucide-react';

interface EditMessage {
  id: string;
  sender: 'user' | 'bookgenie';
  text: string;
  timestamp: string;
}

interface EditAssistantPanelProps {
  onApplyInstruction: (instruction: string) => Promise<void>;
  isProcessing: boolean;
  activeStage?: string;
  hasRevisions: boolean;
  onUndoLastChange: () => void;
  currentPageNumber?: number;
}

const QUICK_SUGGESTIONS = [
  'Make the story longer',
  'Change the cover style',
  'Add more illustrations',
  'Make it suitable for ages 8–12',
  'Change the art style',
  'Improve this chapter',
  'Make the language simpler',
  'Add more detail',
];

export function EditAssistantPanel({
  onApplyInstruction,
  isProcessing,
  activeStage,
  hasRevisions,
  onUndoLastChange,
  currentPageNumber = 1,
}: EditAssistantPanelProps) {
  const [instruction, setInstruction] = useState('');
  const [messages, setMessages] = useState<EditMessage[]>([
    {
      id: 'welcome',
      sender: 'bookgenie',
      text: "Hello! Tell me what you'd like to adjust in your book, and I'll refine the content and visuals for you.",
      timestamp: 'Now',
    },
  ]);

  const handleSubmit = async (e?: React.FormEvent, customText?: string) => {
    if (e) e.preventDefault();
    const textToSend = (customText || instruction).trim();
    if (!textToSend || isProcessing) return;

    const userMsgId = Date.now().toString();
    setMessages((prev) => [
      ...prev,
      {
        id: userMsgId,
        sender: 'user',
        text: textToSend,
        timestamp: 'Just now',
      },
    ]);

    setInstruction('');

    // Determine thoughtful BookGenie response
    let responseText = "I'm analyzing your request and updating the affected pages and illustrations.";
    if (textToSend.toLowerCase().includes('character') || textToSend.toLowerCase().includes('protagonist')) {
      responseText = "I'll update the main character throughout the story and regenerate the illustrations where needed.";
    } else if (textToSend.toLowerCase().includes('cover')) {
      responseText = "I'll redesign your front cover composition with updated artwork and typography.";
    } else if (textToSend.toLowerCase().includes('chapter') || textToSend.toLowerCase().includes('this page')) {
      responseText = `I'll enhance and polish Chapter content for Page ${currentPageNumber}.`;
    } else if (textToSend.toLowerCase().includes('longer') || textToSend.toLowerCase().includes('detail')) {
      responseText = "I'm expanding the narrative depth and adding richer descriptions to the chapters.";
    }

    setMessages((prev) => [
      ...prev,
      {
        id: (Date.now() + 1).toString(),
        sender: 'bookgenie',
        text: responseText,
        timestamp: 'Just now',
      },
    ]);

    await onApplyInstruction(textToSend);
  };

  return (
    <div className="w-full h-full flex flex-col justify-between bg-white border-r border-[#EAEAEA] p-5 overflow-hidden">
      {/* Top Header */}
      <div className="pb-4 border-b border-[#F0F0F0]">
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-[17px] font-semibold text-[#111111] font-sans">
            Edit Your eBook
          </h2>
          {hasRevisions && (
            <button
              onClick={onUndoLastChange}
              disabled={isProcessing}
              className="text-[11px] font-medium text-[#777777] hover:text-[#111111] flex items-center gap-1 transition-colors disabled:opacity-50"
              title="Undo last change"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Undo Last Change</span>
            </button>
          )}
        </div>
        <p className="text-[12px] text-[#666666] leading-relaxed">
          Tell me what you want to change, and I'll update it for you.
        </p>
      </div>

      {/* Quick Suggestion Chips */}
      <div className="py-3 border-b border-[#F0F0F0]">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-[#999999] block mb-2">
          Quick Suggestions
        </span>
        <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pr-1 scrollbar-thin">
          {QUICK_SUGGESTIONS.map((chip, idx) => (
            <button
              key={idx}
              type="button"
              disabled={isProcessing}
              onClick={() => handleSubmit(undefined, chip)}
              className="text-[11px] font-medium px-2.5 py-1 rounded-full border border-[#EAEAEA] bg-[#FAF9F6] text-[#333333] hover:border-[#111111] hover:text-[#111111] transition-all disabled:opacity-50 text-left"
            >
              {chip}
            </button>
          ))}
        </div>
      </div>

      {/* Conversation Area */}
      <div className="flex-1 overflow-y-auto py-4 space-y-3.5 pr-1 scrollbar-thin">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex flex-col ${
              m.sender === 'user' ? 'items-end' : 'items-start'
            }`}
          >
            <div
              className={`max-w-[90%] p-3 rounded-2xl text-[13px] leading-relaxed ${
                m.sender === 'user'
                  ? 'bg-[#111111] text-white rounded-br-xs'
                  : 'bg-[#F7F7F7] border border-[#EAEAEA] text-[#222222] rounded-bl-xs'
              }`}
            >
              {m.text}
            </div>
            <span className="text-[10px] text-[#AAAAAA] mt-1 px-1">
              {m.sender === 'user' ? 'You' : 'BookGenie'}
            </span>
          </div>
        ))}

        {/* Real-time updating progress indicator */}
        {isProcessing && (
          <div className="p-4 rounded-xl bg-[#FAF9F6] border border-[#EAEAEA] space-y-2.5 animate-pulse">
            <span className="text-[12px] font-semibold text-[#111111] block">
              Updating your eBook...
            </span>

            <div className="space-y-1.5 text-[11px]">
              <div className="flex items-center gap-2 text-emerald-700 font-medium">
                <Check className="w-3.5 h-3.5" />
                <span>Updating story content</span>
              </div>
              <div className="flex items-center gap-2 text-emerald-700 font-medium">
                <Check className="w-3.5 h-3.5" />
                <span>Regenerating illustrations</span>
              </div>
              <div className="flex items-center gap-2 text-[#666666]">
                <div className="w-3.5 h-3.5 rounded-full border-2 border-neutral-400 border-t-neutral-800 animate-spin" />
                <span>Updating page design</span>
              </div>
              <div className="flex items-center gap-2 text-[#999999]">
                <div className="w-3.5 h-3.5 rounded-full border border-neutral-300" />
                <span>Finalizing changes</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Natural Language Edit Box */}
      <div className="pt-3 border-t border-[#F0F0F0]">
        <form onSubmit={(e) => handleSubmit(e)} className="relative">
          <textarea
            value={instruction}
            onChange={(e) => setInstruction(e.target.value.slice(0, 500))}
            placeholder="Describe the changes you want to make..."
            rows={3}
            disabled={isProcessing}
            className="w-full border border-[#EAEAEA] rounded-xl p-3 pb-8 text-[13px] text-[#111111] placeholder:text-[#999999] focus:outline-none focus:border-[#111111] transition-all resize-none font-sans"
          />

          <div className="absolute left-3 bottom-2.5 text-[11px] text-[#999999]">
            {instruction.length}/500
          </div>

          <button
            type="submit"
            disabled={!instruction.trim() || isProcessing}
            className="absolute right-2.5 bottom-2.5 w-8 h-8 rounded-lg bg-[#111111] hover:bg-[#222222] disabled:opacity-40 text-white flex items-center justify-center transition-all cursor-pointer"
            title="Send instruction"
          >
            <Send className="w-3.5 h-3.5 stroke-[2]" />
          </button>
        </form>
      </div>
    </div>
  );
}
