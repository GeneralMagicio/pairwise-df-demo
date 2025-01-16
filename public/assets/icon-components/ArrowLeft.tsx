import { FC } from "react";

type IconProps = {
  size?: number
};
export const ArrowLeftIcon: FC<IconProps> = ({ size = 12}) =>  {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={size} height={size}>
      <path
        d="M15 19l-7-7 7-7"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>

  );
};
