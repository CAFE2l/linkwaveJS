"use client";

import React from 'react';

export type ToastObj = { id: string; type: 'success'|'error'; msg: string };

export default function Toast({ id, type, msg }: ToastObj){
  return (
    <div className={`flex items-center gap-3 p-3 rounded shadow-md max-w-xs ${type === 'success' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
        {type === 'success' ? '✓' : '✕'}
      </div>
      <div className="text-sm">{msg}</div>
    </div>
  );
}
