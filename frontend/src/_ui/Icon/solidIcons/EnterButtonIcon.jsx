import React from 'react';

const EnterButtonIcon = ({ fill = '#889096', width = '8', className = '', viewBox = '0 0 8 9' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={width} height={width} viewBox={viewBox} fill="none">
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M7.3335 1.57861C7.56361 1.57861 7.75016 1.76516 7.75016 1.99528V4.95824C7.75016 5.24775 7.65077 5.53518 7.45956 5.75529C7.26674 5.97724 6.99159 6.11565 6.68998 6.11565H2.00607L2.77627 6.88585C2.93899 7.04857 2.93899 7.31239 2.77627 7.47511C2.61355 7.63783 2.34973 7.63783 2.18702 7.47511L0.705535 5.99363C0.627395 5.91549 0.583496 5.80951 0.583496 5.699C0.583496 5.58849 0.627395 5.48251 0.705535 5.40437L2.18702 3.92289C2.34973 3.76017 2.61355 3.76017 2.77627 3.92289C2.93899 4.08561 2.93899 4.34943 2.77627 4.51215L2.0061 5.28232H6.68998C6.72971 5.28232 6.78192 5.26464 6.83047 5.20876C6.88062 5.15103 6.91683 5.06165 6.91683 4.95824V1.99528C6.91683 1.76516 7.10338 1.57861 7.3335 1.57861Z"
      fill={fill}
      className={className}
    />
  </svg>
);

export default EnterButtonIcon;