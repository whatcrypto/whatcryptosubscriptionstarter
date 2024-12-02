import React from 'react'

const Loader = () => {
  return (
    <svg
      className="inherit-width inherit-height"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid"
      style={{
        maxHeight: 28,
        maxWidth: 28,
      }}
    >
      <circle
        cx={50}
        cy={50}
        r={32}
        strokeWidth={8}
        stroke="currentColor"
        strokeDasharray="50.26548245743669 50.26548245743669"
        fill="none"
        strokeLinecap="round"
      >
        <animateTransform
          attributeName="transform"
          type="rotate"
          repeatCount="indefinite"
          dur="1.075268817204301s"
          keyTimes="0;1"
          values="0 50 50;360 50 50"
        />
      </circle>
    </svg>
  )
}

export default Loader
