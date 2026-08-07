import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

const CustomCursor = () => {
  const [isHovering, setIsHovering] = useState(false);
  const [isPointer, setIsPointer] = useState(false);

  // Use motion values for smoother animation
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  
  const springConfigDot = { damping: 25, stiffness: 700 };
  const cursorXSpring = useSpring(cursorX, springConfigDot);
  const cursorYSpring = useSpring(cursorY, springConfigDot);

  const springConfigRing = { damping: 20, stiffness: 150 };
  const cursorXSpringRing = useSpring(cursorX, springConfigRing);
  const cursorYSpringRing = useSpring(cursorY, springConfigRing);

  useEffect(() => {
    // Only enable custom cursor if device has a fine pointer (like a mouse)
    if (window.matchMedia('(pointer: fine)').matches) {
      setIsPointer(true);
      
      const style = document.createElement('style');
      style.innerHTML = `* { cursor: none !important; }`;
      document.head.appendChild(style);

      const moveMouse = (e) => {
        cursorX.set(e.clientX);
        cursorY.set(e.clientY);
      };

      const handleMouseOver = (e) => {
        const isClickable = ['A', 'BUTTON', 'INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName) ||
                            e.target.closest('a') || 
                            e.target.closest('button');
        setIsHovering(Boolean(isClickable));
      };

      window.addEventListener('mousemove', moveMouse);
      window.addEventListener('mouseover', handleMouseOver);

      return () => {
        window.removeEventListener('mousemove', moveMouse);
        window.removeEventListener('mouseover', handleMouseOver);
        if (document.head.contains(style)) {
          document.head.removeChild(style);
        }
      };
    }
  }, [cursorX, cursorY]);

  if (!isPointer) return null;

  return (
    <>
      {/* Outer trailing ring */}
      <motion.div
        className="fixed top-0 left-0 w-10 h-10 rounded-full pointer-events-none z-[9999] border-2 border-[#B8860B]"
        style={{
          x: cursorXSpringRing,
          y: cursorYSpringRing,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          backgroundColor: isHovering ? 'rgba(184, 134, 11, 0.15)' : 'rgba(184, 134, 11, 0)',
          scale: isHovering ? 1.4 : 1,
        }}
        transition={{ duration: 0.15 }}
      />
      {/* Inner fast-following dot */}
      <motion.div 
        className="fixed top-0 left-0 w-2.5 h-2.5 rounded-full pointer-events-none z-[10000] bg-[#B8860B]"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          scale: isHovering ? 0 : 1
        }}
        transition={{ duration: 0.15 }}
      />
    </>
  );
};

export default CustomCursor;
