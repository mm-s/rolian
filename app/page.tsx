'use client';

import { useState } from 'react';

export default function Home() {
  const [walletAddress, setWalletAddress] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState('');

function playBeep() {
  const audio = new Audio("/sfx/beep.wav");
  audio.volume = 1.0;
  audio.play().catch(console.error);
}

function playLoadingSound() {
  const audio = new Audio("/sfx/loading.wav");
  audio.volume = 0.6;
  audio.play().catch(console.error);
}

  async function connectWallet() {
    if (!window.ethereum) {
      setError('MetaMask not detected. Install it from https://metamask.io');
      return;
    }

    try {
      setIsConnecting(true);
      playLoadingSound();
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const account = accounts[0];

      const message = "Sign in to Rolian";
      await window.ethereum.request({
        method: 'personal_sign',
        params: [message, account],
      });

      setWalletAddress(account);
      playBeep();
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Connection failed');
    } finally {
      setIsConnecting(false);
    }
  }

  return (
    <div className="zx-background min-h-screen flex items-center justify-center">
      <div className="zx-border w-full max-w-md p-6 text-center bg-black text-white border rounded shadow">
        <h1 className="text-2xl font-zx text-white mb-6">ROL1AN SYSTEM</h1>
<div className="text-left text-green-400 font-zx leading-loose">
        <p className="text-green-400 font-zx text-left">LOAD""</p>
	<p className="zx-prompt mt-2">> <span className="blinker">█</span></p>
</div>

{walletAddress ? (
  <p className="text-green-400 font-mono mt-4">CONNECTED: {walletAddress}</p>
) : (
  isConnecting ? (
    <div className="zx-loader mt-4" />
  ) : (
    <button
      onClick={connectWallet}
      className="zx-button mt-6"
      disabled={isConnecting}
    >
      CONNECT WALLET
    </button>
  )
)}



        {error && (
  <p className="text-red-400 font-zx mt-4">
    {error.includes('metamask.io') ? (
      <a href="https://metamask.io" target="_blank" rel="noopener noreferrer" className="underline">
        {error}
      </a>
    ) : (
      error
    )}
  </p>
)}
      </div>
    </div>
  );
}

