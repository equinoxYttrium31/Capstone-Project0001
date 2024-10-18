import { useEffect, useState, useRef } from 'react';

export function useScrollAnimation(threshold = 0.8) {
  const [isVisible, setIsVisible] = useState(false); // State to trigger animation
  const elementRef = useRef(null); // Ref for the target container

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true); // Trigger animation when in view
            observer.unobserve(entry.target); // Stop observing after animation
          }
        });
      },
      { threshold: threshold } // Trigger when 'threshold' percentage of the element is visible
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      if (elementRef.current) {
        observer.unobserve(elementRef.current);
      }
    };
  }, [threshold]);

  return [isVisible, elementRef];
}
