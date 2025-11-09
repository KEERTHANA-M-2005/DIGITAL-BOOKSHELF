import { createContext, useContext, useState } from 'react';

const PaymentContext = createContext();

export function PaymentProvider({ children }) {
  const [paymentStatus, setPaymentStatus] = useState('idle'); // idle, processing, success, failed

  // Mock payment processing
  const processPayment = async (amount) => {
    setPaymentStatus('processing');
    
    // Simulate API call delay (1.5s)
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Simulate payment failure based on certain conditions (for testing)
    const shouldFail = 
      // Fail if amount is exactly 123 (for testing)
      amount === 123 || 
      // Random failure 20% of the time
      Math.random() < 0.2;
    
    if (!shouldFail) {
      setPaymentStatus('success');
      return {
        paymentId: 'mock_' + Math.random().toString(36).substr(2, 9),
        amount: amount
      };
    } else {
      setPaymentStatus('failed');
      throw new Error(amount === 123 
        ? 'Test payment failure (amount=123)'
        : 'Payment failed (random 20% chance)'
      );
    }
  };

  return (
    <PaymentContext.Provider value={{ processPayment, paymentStatus, setPaymentStatus }}>
      {children}
    </PaymentContext.Provider>
  );
}

export function usePayment() {
  const context = useContext(PaymentContext);
  if (!context) {
    throw new Error('usePayment must be used within a PaymentProvider');
  }
  return context;
}