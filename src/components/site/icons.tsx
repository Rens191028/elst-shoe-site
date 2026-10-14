import type { SVGProps } from "react";

/**
 * Eigen iconenset in één lijnstijl (24px raster, 1.75 lijn, ronde uiteinden) die past bij het
 * logo. Gebruikt voor USP's en categorieën; kleur komt van `currentColor`.
 */
type P = SVGProps<SVGSVGElement>;
const make = (name: string, d: React.ReactNode) => {
  const Icon = (props: P) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {d}
    </svg>
  );
  Icon.displayName = name;
  return Icon;
};

export const IconTruck = make(
  "IconTruck",
  <>
    <path d="M2.5 6.5h10.5v10H2.5z" />
    <path d="M13 10h4l3.5 3.5v3H13" />
    <circle cx="7" cy="17.5" r="1.9" fill="var(--background)" />
    <circle cx="17" cy="17.5" r="1.9" fill="var(--background)" />
  </>,
);
export const IconReturn = make(
  "IconReturn",
  <>
    <path d="M4.5 12a7.5 7.5 0 1 0 2.4-5.5" />
    <path d="M4 4v4.5h4.5" />
  </>,
);
export const IconPay = make(
  "IconPay",
  <>
    <rect x="2.5" y="5" width="19" height="14" rx="3" />
    <path d="M2.5 10h19M6.5 15h4" />
  </>,
);
export const IconClock = make(
  "IconClock",
  <>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5.5l3.5 2" />
  </>,
);
export const IconChat = make("IconChat", <path d="M4 5h16v11H9.5L5 20v-4H4z" />);
export const IconBoot = make(
  "IconBoot",
  <>
    <path d="M7 3h6v8l6 3v5H7z" />
    <path d="M7 15.5h12" />
  </>,
);
export const IconSneaker = make(
  "IconSneaker",
  <>
    <path d="M2.5 16.5V11.5c2.3 0 4-.9 5-2.6l1.5-2.9 2 1.3c1 1.7 3 2.7 5.5 3.2 2.5.5 4.5 1.4 4.5 3.5v2.5z" />
    <path d="M2.5 19.5h19M9.8 9l1.7 1.5M12 7.8l1.6 1.5" />
  </>,
);
export const IconTrail = make(
  "IconTrail",
  <>
    <path d="M6 3h6v7l6 3v6H6z" />
    <path d="M6 19l1.5-2 1.5 2 1.5-2 1.5 2 1.5-2 1.5 2 1.5-2" />
  </>,
);
export const IconSlipper = make(
  "IconSlipper",
  <>
    <path d="M3 15c0-4 3-7 8-7 3.5 0 5.5 1.7 8 3 1.7.9 2 2 2 4v1H3z" />
    <path d="M3 18.5h18" />
  </>,
);
export const IconBox = make(
  "IconBox",
  <>
    <path d="M12 3l8 4v10l-8 4-8-4V7z" />
    <path d="M4 7l8 4 8-4M12 11v10" />
  </>,
);
export const IconBag = make(
  "IconBag",
  <>
    <path d="M5 8h14l1 12H4z" />
    <path d="M9 8V6.5a3 3 0 0 1 6 0V8" />
  </>,
);
export const IconBigBag = make(
  "IconBigBag",
  <>
    <path d="M3 8.5h18V20H3z" />
    <path d="M8 8.5V5.5h8v3M3 13.5h18" />
  </>,
);
export const IconWallet = make(
  "IconWallet",
  <>
    <path d="M3 7.5h16a2 2 0 0 1 2 2V19H5a2 2 0 0 1-2-2z" />
    <path d="M3 7.5L15 4.5l1 3M16.5 13.5h2" />
  </>,
);
export const IconGem = make(
  "IconGem",
  <>
    <path d="M6 3.5h12l4 5.5-10 12L2 9z" />
    <path d="M2 9h20M9 3.5L7 9l5 12 5-12-2-5.5" />
  </>,
);
