import React from 'react';

const STATUS_CONFIG = {
  draft:     { label: "Draft",            ink: "#6B6558", stampRotate: "-rotate-3" },
  submitted: { label: "Submitted",        ink: "#16213E", stampRotate: "rotate-2" },
  verified:  { label: "Verified by SAG",  ink: "#2F6F4F", stampRotate: "-rotate-2" },
  rejected:  { label: "Rejected",         ink: "#8B2E2E", stampRotate: "rotate-3" },
  disbursed: { label: "Disbursed",        ink: "#B8860B", stampRotate: "-rotate-3" },
};

const StatusStamp = ({ status, label }) => {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.draft;
  const displayLabel = label || config.label;

  return (
    <div
      className={`shrink-0 inline-block border-2 rounded px-4 py-2 ${config.stampRotate}`}
      style={{ borderColor: config.ink, color: config.ink }}
    >
      <p className="font-serif-display text-sm sm:text-base font-semibold uppercase tracking-wide text-center">
        {displayLabel}
      </p>
    </div>
  );
};

export default StatusStamp;
