import React, { useEffect, useState } from 'react';
import { usePayment } from '../context/PaymentContext';
import { useAuth } from '../context/AuthContext';

export default function PaymentModal({ amount = 0, onSuccess = () => {}, onCancel = () => {}, isOpen = false }) {
  const { processPayment, paymentStatus, setPaymentStatus } = usePayment();
  const { user } = useAuth();

  const [step, setStep] = useState('billing');
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [billingDetails, setBillingDetails] = useState({ name: '', email: '', address: '', phone: '' });
  const [selectedMethod, setSelectedMethod] = useState('card');
  const [errorMessage, setErrorMessage] = useState('');

  const paymentMethods = [
    { id: 'card', name: 'Card', icon: '💳' },
    { id: 'upi', name: 'UPI', icon: '🔄' },
    { id: 'netbanking', name: 'Net Banking', icon: '🏛️' },
    { id: 'wallet', name: 'Wallet', icon: '💰' }
  ];

  useEffect(() => {
    if (!user || !isOpen) return;
    const keyUser = user.email || 'guest';
    try {
      const addrMap = JSON.parse(localStorage.getItem('addresses') || '{}');
      if (Array.isArray(addrMap[keyUser])) {
          setAddresses(addrMap[keyUser]);
          // Auto-select first address if available
          if (addrMap[keyUser].length > 0) {
            const defaultAddr = addrMap[keyUser][0];
            setSelectedAddress(defaultAddr);
            setBillingDetails(prev => ({
              ...prev,
              name: user.name || prev.name || '',
              email: user.email || prev.email || '',
              address: `${defaultAddr.line1}${defaultAddr.line2 ? ', ' + defaultAddr.line2 : ''}, ${defaultAddr.city}, ${defaultAddr.state} ${defaultAddr.zip}`,
              phone: defaultAddr.phone || prev.phone || ''
            }));
          }
      }
    } catch (e) {
      setAddresses([]);
    }
    setBillingDetails(prev => ({ ...prev, name: user.name || prev.name || '', email: user.email || prev.email || '' }));
  }, [user, isOpen]);

  useEffect(() => {
    if (paymentStatus === 'processing') setStep('processing');
    else if (paymentStatus === 'success') {
      setStep('success');
      const t = setTimeout(() => { onSuccess(); if (setPaymentStatus) setPaymentStatus('idle'); }, 1000);
      return () => clearTimeout(t);
    } else if (paymentStatus === 'failed') {
      setStep('failed');
      setErrorMessage('Payment failed. Please try again.');
    }
  }, [paymentStatus, onSuccess, setPaymentStatus]);

  useEffect(() => {
    if (!isOpen) {
      setStep('billing');
      setSelectedAddress(null);
      setSelectedMethod('card');
      setErrorMessage('');
      setBillingDetails(prev => ({ ...prev, address: '', phone: '' }));
      if (setPaymentStatus) setPaymentStatus('idle');
    }
  }, [isOpen, setPaymentStatus]);

  const handlePayNow = async () => {
    if (!billingDetails.name || !billingDetails.email) {
      setErrorMessage('Please fill in your contact details.');
      return;
    }

    if (!billingDetails.phone || billingDetails.phone.length !== 10) {
      setErrorMessage('Please enter a valid 10-digit phone number.');
      return;
    }

    if (!selectedAddress && !billingDetails.address) {
      setErrorMessage('Please select or enter an address.');
      return;
    }
    setErrorMessage('');
    try { await processPayment(amount); } 
    catch (err) { setErrorMessage(err?.message || 'Payment failed'); setPaymentStatus('failed'); }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBillingDetails(prev => ({ ...prev, [name]: value }));
  };

  const handleProceed = (e) => { e.preventDefault(); setStep('payment'); };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
        <div className="p-4 border-b border-white flex justify-between items-center">
          <div>
            <div className="font-semibold text-black">Secure Payment</div>
            <div className="text-sm">Amount: ₹{Number(amount).toFixed(2)}</div>
          </div>
          <button onClick={onCancel} className="text-black hover:text-gray-800">✕</button>
        </div>

        {step === 'billing' && (
          <form onSubmit={handleProceed} className="p-4 space-y-3">
            <div className="mb-3">
              <h3 className="font-medium text-black">Billing Details</h3>
            </div>

            {/* Address will be prefixed from profile when available; no saved-address selector shown here */}

            <input 
              name="name" 
              value={billingDetails.name} 
              onChange={handleInputChange} 
              placeholder="Full name" 
              className="w-full px-3 py-2 border border-white rounded bg-white text-black" 
              required 
            />
            <input 
              name="email" 
              value={billingDetails.email} 
              onChange={handleInputChange} 
              placeholder="Email" 
              className="w-full px-3 py-2 border border-white rounded bg-white text-black" 
              required 
            />
            <input 
              name="phone" 
              value={billingDetails.phone} 
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                setBillingDetails(prev => ({ ...prev, phone: value }));
              }} 
              placeholder="10-digit phone number" 
              className="w-full px-3 py-2 border border-white rounded bg-white text-black" 
              required 
            />

            <textarea 
              name="address" 
              value={billingDetails.address} 
              onChange={handleInputChange} 
              placeholder="Address" 
              className="w-full px-3 py-2 border border-white rounded bg-white text-black" 
              rows={2} 
              required 
              readOnly={!!selectedAddress}
            />
            {errorMessage && <div className="text-sm text-red-600">{errorMessage}</div>}
            <div className="flex gap-2">
              <button type="submit" className="flex-1 bg-blue-600 text-white py-2 rounded">Proceed</button>
              <button type="button" onClick={onCancel} className="flex-1 border border-white text-black py-2 rounded">Cancel</button>
            </div>
          </form>
        )}

        {step === 'payment' && (
          <div className="p-4 space-y-3">
            {paymentMethods.map(m => (
              <button 
                key={m.id} 
                type="button" 
                onClick={() => setSelectedMethod(m.id)} 
                className={`w-full flex items-center gap-3 p-2 rounded border ${
                  selectedMethod === m.id 
                    ? 'border-blue-500 bg-blue-50 text-black' 
                    : 'border-white text-black'
                }`}
              >
                <span className="text-xl">{m.icon}</span>
                <span className="font-medium">{m.name}</span>
              </button>
            ))}
            <div className="pt-2">
              <button 
                onClick={handlePayNow} 
                className="w-full bg-blue-600 text-white py-2 rounded"
              >
                Pay ₹{Number(amount).toFixed(2)}
              </button>
              <button 
                onClick={() => setStep('billing')} 
                className="w-full mt-2 border border-white text-black py-2 rounded"
              >
                Back
              </button>
            </div>
          </div>
        )}

        {step === 'processing' && (
          <div className="p-6 text-center">
            <div className="animate-spin h-10 w-10 border-b-2 border-blue-500 rounded-full mx-auto mb-3" />
            <div className="text-black">Processing payment...</div>
          </div>
        )}

        {step === 'failed' && (
          <div className="p-4 text-center">
            <div className="text-red-500 text-2xl mb-2">✕</div>
            <div className="font-semibold text-black">Payment failed</div>
            <div className="mt-2 text-sm text-black">{errorMessage}</div>
            <div className="mt-3 flex gap-2">
              <button onClick={() => { setErrorMessage(''); if (setPaymentStatus) setPaymentStatus('idle'); setStep('payment'); }} className="flex-1 bg-blue-600 text-white py-2 rounded">Retry</button>
              <button onClick={onCancel} className="flex-1 border border-white text-black py-2 rounded">Cancel</button>
            </div>
          </div>
        )}

        {step === 'success' && (
          <div className="p-6 text-center">
            <div className="text-green-500 text-3xl mb-2">✓</div>
            <div className="font-semibold text-black">Payment successful</div>
          </div>
        )}
      </div>
    </div>
  );
}
