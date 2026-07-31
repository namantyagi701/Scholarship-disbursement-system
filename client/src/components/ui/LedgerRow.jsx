import React from 'react';

const LedgerRow = ({ label, value, children }) => {
  return (
    <div className="flex items-center sm:items-baseline justify-between gap-4 py-3 border-b border-[#EDE9DE] last:border-0">
      <span className="text-xs text-[#8A8374] uppercase tracking-wide shrink-0">
        {label}
      </span>
      {children ? (
        <div className="flex items-center gap-2 justify-end text-right">
          {children}
        </div>
      ) : (
        <span className="text-sm text-[#16213E] font-medium text-right truncate">
          {value}
        </span>
      )}
    </div>
  );
};

export default LedgerRow;
