import React, { ReactNode } from "react";

interface SelectProps {
  children: ReactNode;
}

export const Select: React.FC<SelectProps> = ({ children }) => {
  return <div className="select">{children}</div>;
};

interface SelectTriggerProps {
  children: ReactNode;
  className?: string;
}

export const SelectTrigger: React.FC<SelectTriggerProps> = ({ children, className }) => {
  return <div className={`select-trigger ${className || ""}`}>{children}</div>;
};

interface SelectContentProps {
  children: ReactNode;
}

export const SelectContent: React.FC<SelectContentProps> = ({ children }) => {
  return <div className="select-content">{children}</div>;
};

interface SelectItemProps {
  value: string | number;
  children: ReactNode;
}

export const SelectItem: React.FC<SelectItemProps> = ({ value, children }) => {
  return <div className="select-item" data-value={value}>{children}</div>;
};
// import React from "react";

// export const Select = ({ children }) => {
//     return <div className="select">{children}</div>;
// };

// export const SelectTrigger = ({ children, className }) => {
//     return <div className={`select-trigger ${className}`}>{children}</div>;
// };

// export const SelectContent = ({ children }) => {
//     return <div className="select-content">{children}</div>;
// };

// export const SelectItem = ({ value, children }) => {
//     return <div className="select-item" value={value}>{children}</div>;
// };