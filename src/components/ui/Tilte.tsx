import React from "react";

interface TitleProps {
  children: React.ReactNode;
  className?: string; // Để dấu ? để không bắt buộc phải truyền className
}

export default function Title({
  children,
  className = "", // Giá trị mặc định là chuỗi rỗng
}: TitleProps) {
  return (
    <h1
      className={`text-3xl font-bold transition-colors duration-300 text-[#005691] ${className}`}
    >
      {children}
    </h1>
  );
}
