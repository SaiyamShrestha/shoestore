import type { SVGProps } from 'react';

const ShoeIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M7 17v-4h10v4" />
    <path d="M15.5 13.5c0-2-1.5-4.5-4.5-4.5S6.5 9.5 6.5 13" />
    <path d="M7 13H4.5a1.5 1.5 0 0 1 0-3H7" />
    <path d="M17 13h2.5a1.5 1.5 0 0 0 0-3H17" />
    <path d="M7 17c0 1.1.9 2 2 2h6a2 2 0 0 0 2-2v-2.5" />
  </svg>
);

export default ShoeIcon;
