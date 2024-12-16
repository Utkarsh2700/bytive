import React, { useState } from "react";

type DropAreaProps = {
  onDrop: (status?: boolean, position?: number) => void;
};

const DropArea: React.FC<DropAreaProps> = ({ onDrop }) => {
  const [showDrop, setShowDrop] = useState(false);
  return (
    <section
      onDragEnter={() => setShowDrop(true)}
      onDragLeave={() => setShowDrop(false)}
      onDrop={() => {
        onDrop();
        setShowDrop(false);
      }}
      onDragOver={(e) => e.preventDefault()}
      className={`my-2 w-full h-[100px] text-[#dcdcdc] border-dashed border-[#dcdcdc] border rounded-[10px] p-4 mb-4 ${
        showDrop
          ? "opacity-100 transition-all duration-200 ease-in-out"
          : "opacity-0"
      }`}
    >
      Drop Here
    </section>
  );
};

export default DropArea;
