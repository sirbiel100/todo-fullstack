import * as React from "react";

const MutedSound: React.FC<React.SVGProps<SVGElement>> = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="800"
    height="800"
    fill="none"
    viewBox="0 0 24 24"
  >
    <path
      fill="#0F0F0F"
      fillRule="evenodd"
      d="M14 3c0-1.922-2.447-2.738-3.6-1.2L6.5 7H4a3 3 0 0 0-3 3v4a3 3 0 0 0 3 3h2.494l3.894 5.305C11.53 23.863 14 23.054 14 21.12zM8.1 8.2 12 3v18.121l-3.894-5.304A2 2 0 0 0 6.494 15H4a1 1 0 0 1-1-1v-4a1 1 0 0 1 1-1h2.5a2 2 0 0 0 1.6-.8"
      clipRule="evenodd"
    ></path>
    <path
      fill="#0F0F0F"
      d="M21.293 8.57a1 1 0 1 1 1.414 1.415l-1.947 1.947 1.947 1.947a1 1 0 0 1-1.414 1.414l-1.947-1.947-1.947 1.947a1 1 0 0 1-1.414-1.414l1.947-1.947-1.947-1.947A1 1 0 1 1 17.4 8.571l1.947 1.947z"
    ></path>
  </svg>
);

export default MutedSound;
