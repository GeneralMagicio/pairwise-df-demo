import React, { useState, useRef, useEffect } from 'react';
import styles from '@/app/styles/Project.module.css';

interface ProjectDescriptionProps {
  description: string
}

const ProjectDescription: React.FC<ProjectDescriptionProps> = ({ description }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showButtons, setShowButtons] = useState(false);
  const textRef = useRef<HTMLParagraphElement>(null);

  // Check if the description has more than 3 lines
  useEffect(() => {
    if (textRef.current) {
      const maxHeight = parseInt(getComputedStyle(textRef.current).lineHeight) * 3;
      if (textRef.current.scrollHeight > maxHeight) {
        setShowButtons(true);
      }
    }
  }, [description]);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="mb-1 flex flex-col">
      <p
        ref={textRef}
        onClick={toggleExpand}
        className={`mb-2 cursor-pointer text-base font-normal leading-6 text-slate-600 xxsl:text-sm ${
          !isExpanded && showButtons ? styles.lineClamp : ''
        }`}
      >
        {description}
      </p>
      {showButtons && !isExpanded && (
        <span
          onClick={toggleExpand}
          className="cursor-pointer font-semibold text-dark-600 hover:underline"
        >
          View more
        </span>
      )}
      {showButtons && isExpanded && (
        <span
          onClick={toggleExpand}
          className="cursor-pointer font-semibold text-dark-600 hover:underline"
        >
          View less
        </span>
      )}
    </div>
  );
};

export default ProjectDescription;
