'use client';

import { useEffect, useState } from 'react';
import { ethers } from 'ethers';


function playPilotTone() {
const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
const audioCtx = new AudioContextClass();


  const oscillator = audioCtx.createOscillator();
  oscillator.type = 'square';
  oscillator.frequency.setValueAtTime(806, audioCtx.currentTime);
  oscillator.connect(audioCtx.destination);
  oscillator.start();
  return () => oscillator.stop();
}

export default function Home() {
  const [walletAddress, setWalletAddress] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState('');
  const [flashBorder, setFlashBorder] = useState(true);
  const [userConfig, setUserConfig] = useState({
    name: '',
    enableFeatureX: false,
    deploymentSize: 'small',
    notes: ''
  });
  const [paymentTxHash, setPaymentTxHash] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => setFlashBorder(false), 1000);
    return () => clearTimeout(timer);
  }, []);

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
    } catch (err) {
      console.error(err);
      setError(err.message || 'Connection failed');
    } finally {
      setIsConnecting(false);
    }
  }

  function handleConfigChange(e) {
    const { name, value, type, checked } = e.target;
    setUserConfig(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  }

async function initiatePayment() {
  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const tx = await signer.sendTransaction({
      to: '0x40688912a44c7CbB87FE8FFAAAc5ae7aEAaf8452',
      value: ethers.parseEther("0.01")
    });
    setPaymentTxHash(tx.hash);
  } catch (err) {
    console.error(err);
    setError('Payment failed: ' + err.message);
  }
}


  return (
    <div className="zx-frame">
      <div className={`zx-border-frame ${flashBorder ? 'flash-border' : ''} ${isConnecting ? 'loading' : ''}`}>
        <div className="zx-screen font-zx text-center">
          <h1 className="text-2xl font-zx text-white mb-6">ROL1AN SYSTEM</h1>

          <div className="text-left text-green-400 font-zx leading-loose">
            <p>LOAD""</p>
            <p className="zx-prompt mt-2">&gt; <span className="blinker">█</span></p>
          </div>

          {walletAddress ? (
            <>
              <p className="text-green-400 font-mono mt-4">CONNECTED: {walletAddress}</p>
              <div className="text-left mt-6">
                <label>
                  Name:
                  <input name="name" type="text" value={userConfig.name} onChange={handleConfigChange} className="block mt-1 text-black" />
                </label>
                <label className="block mt-2">
                  Enable Feature X:
                  <input name="enableFeatureX" type="checkbox" checked={userConfig.enableFeatureX} onChange={handleConfigChange} className="ml-2" />
                </label>
                <label className="block mt-2">
                  Deployment Size:
                  <select name="deploymentSize" value={userConfig.deploymentSize} onChange={handleConfigChange} className="block text-black">
                    <option value="small">Small</option>
                    <option value="medium">Medium</option>
                    <option value="large">Large</option>
                  </select>
                </label>
                <label className="block mt-2">
                  Notes:
                  <textarea name="notes" value={userConfig.notes} onChange={handleConfigChange} className="block w-full mt-1 text-black" />
                </label>
                <button className="zx-button mt-4" onClick={initiatePayment}>PAY & DEPLOY (0.01 ETH)</button>
                {paymentTxHash && (
                  <p className="text-green-300 text-xs mt-2">TX Hash: {paymentTxHash}</p>
                )}
              </div>
            </>
          ) : isConnecting ? (
            <div className="zx-loader mt-4" />
          ) : (
            <button onClick={connectWallet} className="zx-button mt-6" disabled={isConnecting}>
              CONNECT WALLET
            </button>
          )}

          {error && (
            <p className="text-red-400 font-zx mt-4">
              {error.includes('metamask.io') ? (
                <a
                  href="https://metamask.io"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                >
                  {error}
                </a>
              ) : (
                error
              )}
            </p>
          )}

        </div>
      </div>
    </div>
  );
}

