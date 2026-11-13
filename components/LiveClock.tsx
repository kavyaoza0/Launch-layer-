import React, { useState, useEffect } from 'react';

export const LiveClock: React.FC<{ className?: string }> = ({ className = '' }) => {
  const [timeStr, setTimeStr] = useState('');

  useEffect(() => {
    const update = () => {
      const now = new Date();
      // Indian Standard Time (IST)
      const istString = now.toLocaleTimeString('en-US', {
        timeZone: 'Asia/Kolkata',
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
      setTimeStr(istString);
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <span className={`font-mono tabular-nums ${className}`}>
      {timeStr || '12:00:00'} IST
    </span>
  );
};

export default LiveClock;
