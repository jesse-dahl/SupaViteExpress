import React from 'react';

interface LoaderProps {
  size?: number
  color?: string
}

const Loader: React.FC<LoaderProps> = ({
  size = 32,
  color = "white"
}) => {

  return (
    <div
      className={`inline-block animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]`}
      role="status"
      style={{
        height: `${size}px`,
        width: `${size}px`,
        color: color
      }}
    >
    <span
      className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]"
    >
      Loading...
    </span>
  </div>
  );
}

export default Loader;
