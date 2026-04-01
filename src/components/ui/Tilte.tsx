import React from "react";

interface TitleProps {
  children: React.ReactNode;
  className?: string;
}

export default function Title({ children, className = "" }: TitleProps) {
  return (
    <h1
      className={`text-3xl font-bold transition-colors duration-300 text-[#005691] ${className}`}
    >
      {children}
    </h1>
  );
}
