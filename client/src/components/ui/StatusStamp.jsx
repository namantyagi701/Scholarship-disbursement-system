import React from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

const STATUS_CONFIG = {
  draft:           { label: "Draft",            ink: "#6B6558", stampRotate: "-rotate-3" },
  submitted:       { label: "Submitted",        ink: "#16213E", stampRotate: "rotate-2" },
  verified:        { label: "Verified by SAG",  ink: "#2F6F4F", stampRotate: "-rotate-2" },
  rejected:        { label: "Rejected",         ink: "#8B2E2E", stampRotate: "rotate-3" },
  disbursed:       { label: "Disbursed",        ink: "#B8860B", stampRotate: "-rotate-3" },
  // Finance specific
  pending:         { label: "Pending",          ink: "#B8860B", stampRotate: "rotate-2" },
  paid:            { label: "Paid",             ink: "#2F6F4F", stampRotate: "-rotate-2" },
  failed:          { label: "Failed",           ink: "#8B2E2E", stampRotate: "rotate-3" },
  generated:       { label: "Generated",        ink: "#16213E", stampRotate: "-rotate-2" },
  "sent to bank":  { label: "Sent to Bank",     ink: "#B8860B", stampRotate: "rotate-2" },
  processing:      { label: "Processing",       ink: "#B8860B", stampRotate: "-rotate-3" },
  completed:       { label: "Completed",        ink: "#2F6F4F", stampRotate: "-rotate-2" },
};

const StatusStamp = ({ status, label }) => {
  const normalizedStatus = (status || '').toLowerCase();
  const config = STATUS_CONFIG[normalizedStatus] || STATUS_CONFIG.draft;
  const displayLabel = label || config.label;
  const shouldReduceMotion = useReducedMotion();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={normalizedStatus}
        initial={{ opacity: 0, scale: shouldReduceMotion ? 1 : 1.3 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.9, transition: { duration: 0.15 } }}
        transition={{ type: "spring", damping: 12, stiffness: 200 }}
        className={`shrink-0 inline-block border-2 rounded px-4 py-2 ${config.stampRotate}`}
        style={{ borderColor: config.ink, color: config.ink }}
      >
        <p className="font-serif-display text-sm sm:text-base font-semibold uppercase tracking-wide text-center">
          {displayLabel}
        </p>
      </motion.div>
    </AnimatePresence>
  );
};

export default StatusStamp;
