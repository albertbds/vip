import React, { useEffect, useState } from 'react';
import { Users } from 'lucide-react';

export function OnlineCounter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    // Simulate initial count between 50-150
    const initialCount = Math.floor(Math.random() * (150 - 50 + 1)) + 50;
    setCount(initialCount);

    // Simulate count changes every 3-10 seconds
    const interval = setInterval(() => {
      setCount(prev => {
        const change = Math.random() > 0.5 ? 1 : -1;
        const newCount = prev + change;
        return Math.max(50, Math.min(150, newCount)); // Keep between 50-150
      });
    }, Math.random() * (10000 - 3000) + 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg">
      <Users size={16} className="text-green-400" />
      <span className="text-sm text-white">
        <span className="font-semibold">{count}</span> online agora
      </span>
    </div>
  );
}