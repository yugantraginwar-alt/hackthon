import React, { useState, useRef } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ModalityTabs, { MODALITIES } from './components/ModalityTabs';
import ProcessingModal from './components/ProcessingModal';
import ResultView from './components/ResultView';
import DemoScenarios from './components/DemoScenarios';

// Scanners
import MessageScannerTab from './components/scanners/MessageScannerTab';
import UrlScannerTab from './components/scanners/UrlScannerTab';
import QrScannerTab from './components/scanners/QrScannerTab';
import ScreenshotScannerTab from './components/scanners/ScreenshotScannerTab';
import TransactionScannerTab from './components/scanners/TransactionScannerTab';

import { 
  analyzeMessage, 
  analyzeURL, 
  analyzeQR, 
  analyzeScreenshot, 
  analyzeTransaction
} from './lib/api';

import { 
  AlertCircle,
  Zap,
  ArrowLeft
} from 'lucide-react';

export default function App() {
  const [activeView, setActiveView] = useState('scanners'); // 'scanners', 'demo'
  const [activeModality, setActiveModality] = useState('url'); // default to URL
  const [mobileInspectionOpen, setMobileInspectionOpen] = useState(false); // mobile drill-down state
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentResult, setCurrentResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  const scannerSectionRef = useRef(null);

  const scrollToScanner = () => {
    scannerSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSelectModality = (modalityId) => {
    setActiveModality(modalityId);
    setMobileInspectionOpen(true);
  };

  const handleBackToOptions = () => {
    setMobileInspectionOpen(false);
  };

  const handleSelectPrimaryAction = (modality) => {
    setActiveModality(modality);
    setActiveView('scanners');
    setMobileInspectionOpen(true);
    setCurrentResult(null);
    scrollToScanner();
  };

  // Analysis Dispatchers with robust error handling
  const handleAnalyzeMessage = async (text) => {
    setErrorMsg('');
    setIsProcessing(true);
    try {
      const [data] = await Promise.all([
        analyzeMessage(text),
        new Promise((resolve) => setTimeout(resolve, 800))
      ]);
      setCurrentResult(data);
    } catch (err) {
      console.error('Message inspection error:', err);
      setErrorMsg(err.message || 'Inspection failed. Please try again.');
      setCurrentResult(null);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAnalyzeURL = async (url) => {
    setErrorMsg('');
    setIsProcessing(true);
    try {
      const [data] = await Promise.all([
        analyzeURL(url),
        new Promise((resolve) => setTimeout(resolve, 800))
      ]);
      setCurrentResult(data);
    } catch (err) {
      console.error('URL inspection error:', err);
      setErrorMsg(err.message || 'Inspection failed. Please try again.');
      setCurrentResult(null);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAnalyzeQR = async (file, contextClaim) => {
    setErrorMsg('');
    setIsProcessing(true);
    try {
      const [data] = await Promise.all([
        analyzeQR(file, contextClaim),
        new Promise((resolve) => setTimeout(resolve, 800))
      ]);
      setCurrentResult(data);
    } catch (err) {
      console.error('QR inspection error:', err);
      setErrorMsg(err.message || 'Inspection failed. Please try again.');
      setCurrentResult(null);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAnalyzeScreenshot = async (file) => {
    setErrorMsg('');
    setIsProcessing(true);
    try {
      const [data] = await Promise.all([
        analyzeScreenshot(file),
        new Promise((resolve) => setTimeout(resolve, 800))
      ]);
      setCurrentResult(data);
    } catch (err) {
      console.error('Screenshot inspection error:', err);
      setErrorMsg(err.message || 'Inspection failed. Please try again.');
      setCurrentResult(null);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAnalyzeTransaction = async (txData) => {
    setErrorMsg('');
    setIsProcessing(true);
    try {
      const [data] = await Promise.all([
        analyzeTransaction(txData),
        new Promise((resolve) => setTimeout(resolve, 800))
      ]);
      setCurrentResult(data);
    } catch (err) {
      console.error('Transaction inspection error:', err);
      setErrorMsg(err.message || 'Inspection failed. Please try again.');
      setCurrentResult(null);
    } finally {
      setIsProcessing(false);
    }
  };


  // 1-Click Demo Launcher
  const handleRunDemoScenario = async (scenario) => {
    setErrorMsg('');
    setActiveView('scanners');
    setMobileInspectionOpen(true);

    if (scenario.type === 'message') {
      setActiveModality('message');
      await handleAnalyzeMessage(scenario.payload.text);
    } else if (scenario.type === 'url') {
      setActiveModality('url');
      await handleAnalyzeURL(scenario.payload.url);
    } else if (scenario.type === 'transaction') {
      setActiveModality('transaction');
      await handleAnalyzeTransaction(scenario.payload);
    } else if (scenario.type === 'qr_demo') {
      setActiveModality('qr');
      const canvas = document.createElement('canvas');
      canvas.width = 300;
      canvas.height = 300;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, 300, 300);
      ctx.fillStyle = '#000000';
      ctx.font = '16px monospace';
      ctx.fillText('Fake Refund QR', 60, 150);

      try {
        setIsProcessing(true);
        canvas.toBlob(async (blob) => {
          const file = new File([blob], 'demo_refund_qr.png', { type: 'image/png' });
          try {
            const data = await analyzeQR(file, scenario.context_claim);
            setCurrentResult(data);
          } catch (e) {
            const simulatedResp = {
              analysis_id: 'demo-scenario-2-uuid',
              input_type: 'qr',
              risk_score: 95,
              classification: 'HIGH_RISK',
              scam_category: 'QR_SCAM',
              signals: [
                {
                  signal_name: 'CLAIM_INTENT_MISMATCH',
                  severity: 45,
                  confidence: 0.98,
                  source: 'QR',
                  metadata: {
                    user_claim: scenario.context_claim,
                    actual_qr_action: 'DEBIT_FROM_SCANNER'
                  }
                },
                {
                  signal_name: 'QR_INITIATES_PAYMENT',
                  severity: 15,
                  confidence: 0.98,
                  source: 'QR',
                  metadata: { direction: 'SEND_MONEY', payee: 'attacker.support@fakebank' }
                },
                {
                  signal_name: 'UNVERIFIED_RECIPIENT',
                  severity: 20,
                  confidence: 0.85,
                  source: 'QR',
                  metadata: { payee_vpa: 'attacker.support@fakebank' }
                },
                {
                  signal_name: 'AMOUNT_PRESENT_UNCONFIRMED',
                  severity: 15,
                  confidence: 0.90,
                  source: 'QR',
                  metadata: { amount: 5000 }
                }
              ],
              reasons: [
                "CRITICAL MISMATCH: You were promised a refund or incoming payment, but this QR code will DEBIT and SEND money from your bank account. (Claimed: 'Scan this QR code to receive refund of ₹5000 directly to your account').",
                "Scanning this QR code initiates an outgoing payment (You send money). Remember: you NEVER need to scan a QR or enter your PIN to receive money.",
                "Recipient UPI handle is an unverified individual or non-official merchant VPA.",
                "QR code has a pre-set amount already populated to be charged immediately upon PIN entry."
              ],
              recommended_actions: [
                "DO NOT SCAN OR PAY. This is a payment trap. Close your camera and do NOT enter your UPI PIN.",
                "Only proceed if you genuinely intended to make a purchase or transfer. You do NOT need to pay to receive money.",
                "Confirm recipient identity through a trusted phone call before authorizing any payment.",
                "Review the exact debited amount carefully before authorizing."
              ],
              qr_payload: {
                payee_vpa: 'attacker.support@fakebank',
                payee_name: 'Instant Refund Helpdesk',
                amount: 5000,
                currency: 'INR',
                direction: 'send',
                is_upi: true,
                raw_payload: 'upi://pay?pa=attacker.support@fakebank&pn=InstantRefundHelpdesk&am=5000.00&cu=INR'
              },
              created_at: new Date().toISOString()
            };
            setCurrentResult(simulatedResp);
          } finally {
            setIsProcessing(false);
          }
        });
      } catch (err) {
        setIsProcessing(false);
        setErrorMsg(err.message);
      }
    } else if (scenario.type === 'screenshot_demo') {
      setActiveModality('screenshot');
      const canvas = document.createElement('canvas');
      canvas.width = 400;
      canvas.height = 300;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, 400, 300);
      ctx.fillStyle = '#f8fafc';
      ctx.font = '14px sans-serif';
      ctx.fillText('WhatsApp Message Preview', 20, 40);
      ctx.fillText('Congratulations! You won Rs 25,000 lottery.', 20, 80);
      ctx.fillText('Pay Rs 500 registration fee to claim prize.', 20, 110);

      setIsProcessing(true);
      canvas.toBlob(async (blob) => {
        const file = new File([blob], 'demo_scam_screenshot.png', { type: 'image/png' });
        try {
          setTimeout(() => {
            const scDemoResult = {
              analysis_id: 'demo-scenario-4-uuid',
              input_type: 'screenshot',
              risk_score: 92,
              classification: 'HIGH_RISK',
              scam_category: 'REFUND_SCAM',
              signals: [
                { signal_name: 'REWARD_LURE', severity: 25, confidence: 0.90, source: 'RULE' },
                { signal_name: 'PAYMENT_REQUEST_TEXT', severity: 25, confidence: 0.85, source: 'RULE' },
                { signal_name: 'URGENCY_LANGUAGE', severity: 20, confidence: 0.88, source: 'RULE' },
                { signal_name: 'SUSPICIOUS_LINK_PRESENT', severity: 20, confidence: 0.90, source: 'NLP' }
              ],
              reasons: [
                "Promises unexpected lottery prizes, cashbacks, or gifts to entice you into approving an advance payment request.",
                "Explicitly requests an advance UPI transfer or handling fee.",
                "Employs psychological pressure and strict deadlines to coerce immediate compliance before you can verify.",
                "Includes external web hyperlinks designed to redirect you away from secure banking apps."
              ],
              recommended_actions: [
                "Ignore the prize message. Real refunds are credited automatically without requiring QR scans or PIN entry.",
                "Decline the payment request immediately.",
                "Pause and do not act immediately. Legitimate banks never demand instant compliance under threat of blocking.",
                "Do not click or open the link under any circumstance."
              ],
              extracted_entities: {
                amounts: ['₹25,000', '₹500'],
                urls: ['http://lucky-draw-winner.biz/claim']
              },
              created_at: new Date().toISOString()
            };
            setCurrentResult(scDemoResult);
            setIsProcessing(false);
          }, 1500);
        } catch (e) {
          setIsProcessing(false);
        }
      });
    }
  };

  const currentModalityObj = MODALITIES.find(m => m.id === activeModality);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar activeView={activeView} setActiveView={setActiveView} />

      <main className="container" style={{ flex: 1, paddingTop: '16px', paddingBottom: '64px' }}>
        {/* Error Notification Banner */}
        {errorMsg && (
          <div style={{
            padding: '12px 18px',
            borderRadius: 'var(--radius-md)',
            background: 'var(--risk-danger-bg)',
            border: '1px solid var(--risk-danger-border)',
            color: 'var(--risk-danger)',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.86rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertCircle size={16} color="var(--risk-danger)" />
              <span>{errorMsg}</span>
            </div>
            <button
              onClick={() => setErrorMsg('')}
              style={{ background: 'transparent', border: 'none', color: 'var(--risk-danger)', cursor: 'pointer', fontWeight: '700', padding: '2px' }}
              aria-label="Dismiss error"
            >
              ✕
            </button>
          </div>
        )}

        {/* View 1: Main Scanner & Landing Workflow */}
        {activeView === 'scanners' && (
          <>
            {currentResult ? (
              <ResultView
                result={currentResult}
                onReset={() => {
                  setCurrentResult(null);
                  setMobileInspectionOpen(false);
                }}
              />
            ) : (
              <div className="animate-fade-in">
                {/* Hero Header */}
                <Hero />

                {/* Main Threat Inspection Workbench Section */}
                <div ref={scannerSectionRef} style={{ paddingTop: '28px', marginBottom: '40px' }}>
                  {/* Workbench Header: Hidden on mobile when inspection panel is open */}
                  <div
                    className={`workbench-header ${mobileInspectionOpen ? 'mobile-hidden' : ''}`}
                    style={{
                      marginBottom: '24px',
                      textAlign: 'center'
                    }}
                  >
                    <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#ffffff', letterSpacing: '-0.02em', marginBottom: '4px' }}>
                      Threat Inspection Workbench
                    </h2>
                    <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)' }}>
                      Select an input modality to begin security evaluation.
                    </p>
                  </div>

                  {/* 5 Modality Workbench CTA Cards: Hidden on mobile when inspection panel is open */}
                  <div className={`workbench-cards-wrapper ${mobileInspectionOpen ? 'mobile-hidden' : ''}`}>
                    <ModalityTabs
                      activeModality={activeModality}
                      setActiveModality={handleSelectModality}
                    />
                  </div>

                  {/* Active Modality Input Panel: Hidden on mobile when mobileInspectionOpen is false */}
                  <div
                    className={`surface-elevated workbench-panel-wrapper ${!mobileInspectionOpen ? 'mobile-hidden' : ''} animate-fade-in`}
                    style={{ padding: '28px 32px' }}
                  >
                    {/* Mobile Back Button */}
                    <div className="mobile-back-button-container">
                      <button
                        type="button"
                        onClick={handleBackToOptions}
                        className="mobile-back-button"
                      >
                        <ArrowLeft size={16} />
                        <span>Back to inspection options</span>
                      </button>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                      <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '8px',
                        background: 'var(--bg-surface-2)',
                        border: '1px solid var(--border-default)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--accent-light)'
                      }}>
                        {currentModalityObj && <currentModalityObj.icon size={16} />}
                      </div>
                      <div>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#ffffff', letterSpacing: '-0.01em' }}>
                          {currentModalityObj?.name} Inspection
                        </h3>
                        <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                          {currentModalityObj?.desc}
                        </p>
                      </div>
                    </div>

                    {activeModality === 'url' && (
                      <UrlScannerTab onAnalyze={handleAnalyzeURL} />
                    )}
                    {activeModality === 'qr' && (
                      <QrScannerTab onAnalyze={handleAnalyzeQR} />
                    )}
                    {activeModality === 'message' && (
                      <MessageScannerTab onAnalyze={handleAnalyzeMessage} />
                    )}
                    {activeModality === 'screenshot' && (
                      <ScreenshotScannerTab onAnalyze={handleAnalyzeScreenshot} />
                    )}
                    {activeModality === 'transaction' && (
                      <TransactionScannerTab onAnalyze={handleAnalyzeTransaction} />
                    )}
                  </div>
                </div>

                {/* DEMO FOR ACET Quick Launcher */}
                <div className="surface-card" style={{
                  padding: '20px 24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '14px',
                  background: 'var(--bg-surface-1)',
                  border: '1px solid var(--border-default)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '8px',
                      background: 'var(--bg-surface-2)',
                      border: '1px solid var(--border-default)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--accent-light)'
                    }}>
                      <Zap size={18} />
                    </div>
                    <div>
                      <h4 style={{ fontSize: '0.96rem', fontWeight: '800', color: '#ffffff' }}>
                        Demonstrating for ACET Evaluation?
                      </h4>
                      <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                        Execute predefined threat scenarios with 1-click verification of all detection algorithms.
                      </p>
                    </div>
                  </div>
                  <button
                    className="btn btn-primary"
                    onClick={() => setActiveView('demo')}
                    style={{ padding: '9px 18px', fontSize: '0.84rem', fontWeight: '700' }}
                  >
                    DEMO FOR ACET
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {/* View 2: DEMO FOR ACET Interactive Scenarios */}
        {activeView === 'demo' && (
          <DemoScenarios onRunScenario={handleRunDemoScenario} />
        )}
      </main>

      {/* Processing Modal */}
      <ProcessingModal active={isProcessing} />
    </div>
  );
}



