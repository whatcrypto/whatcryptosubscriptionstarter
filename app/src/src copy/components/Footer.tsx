import React from 'react';

export function Footer() {
  return (
    <footer className="container mx-auto px-4 py-8 text-center text-slate-400 border-t border-slate-800">
      <p>© {new Date().getFullYear()} WhatCrypto. All rights reserved.</p>
    </footer>
  );
}