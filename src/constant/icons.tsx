import React from "react";
import { SvgIcon, SvgIconProps } from "@mui/material";

interface IconProps {
  fillColor?: string;
}

export const SingleBedIcon: React.FC<IconProps> = ({
  fillColor = "#444",
  ...props
}) => {
  return (
    <SvgIcon {...props} viewBox="0 0 24 24">
      <path
        d="M21 11.75H3a1.5 1.5 0 0 0-1.5 1.5v4a1.5 1.5 0 0 0 1.125 1.45.5.5 0 0 1 .375.483v1.067a1 1 0 1 0 2 0v-1a.5.5 0 0 1 .5-.5h13a.5.5 0 0 1 .5.5v1a1 1 0 0 0 2 0v-1.064a.5.5 0 0 1 .375-.483A1.5 1.5 0 0 0 22.5 17.25v-4a1.5 1.5 0 0 0-1.5-1.5zM4 10.25a.5.5 0 0 0 .5.5h15a.5.5 0 0 0 .5-.5v-5a2.5 2.5 0 0 0-2.5-2.5h-11A2.5 2.5 0 0 0 4 5.25v5zm7-3h2a2.5 2.5 0 0 1 2.166 1.25.5.5 0 0 1-.433.75H9.267a.5.5 0 0 1-.433-.75A2.5 2.5 0 0 1 11 7.25z"
        fill={fillColor}
      />
    </SvgIcon>
  );
};

export const BankTransferIcon: React.FC<IconProps> = ({
  fillColor = "#fff",
}) => {
  return (
    <svg width="32" height="32" fill="none">
      <path
        d="M4 13.5l.5-6 2-1H19l3 1 .5 3V12H11l-1.5 2-.5 6-4.5-1-.5-5.5z"
        fill="url(#icon_method_bank_transfer_svg__paint0_linear)"
      ></path>
      <path
        d="M25.333 12H12a2.667 2.667 0 00-2.667 2.667v8A2.667 2.667 0 0012 25.333h13.333A2.667 2.667 0 0028 22.667v-8A2.667 2.667 0 0025.333 12z"
        fill={fillColor}
        stroke="#2D3748"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></path>
      <path
        d="M18.667 21.333a2.667 2.667 0 100-5.333 2.667 2.667 0 000 5.333zM22.667 12V9.333A2.667 2.667 0 0020 6.667H6.667A2.667 2.667 0 004 9.333v8A2.667 2.667 0 006.667 20h2.666"
        stroke="#2D3748"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></path>
      <defs>
        <linearGradient
          id="icon_method_bank_transfer_svg__paint0_linear"
          x1="13.25"
          y1="6.5"
          x2="13.25"
          y2="20"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#E2E8F0"></stop>
          <stop offset="1" stopColor="#CBD5E0"></stop>
        </linearGradient>
      </defs>
    </svg>
  );
};

export const ZaloPayIcon: React.FC = () => {
  return (
    <SvgIcon width="32" height="32" sx={{ fill: "none" }}>
      <path fill="url(#icon_zalopay_svg__pattern0)" d="M0 1h32v31H0z"></path>
      <defs>
        <pattern
          id="icon_zalopay_svg__pattern0"
          patternContentUnits="objectBoundingBox"
          width="1"
          height="1"
        >
          <use
            xlinkHref="#icon_zalopay_svg__image0_24350_77633"
            transform="matrix(.00176 0 0 .00182 -.027 0)"
          ></use>
        </pattern>
        <image
          id="icon_zalopay_svg__image0_24350_77633"
          width="597"
          height="549"
          xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAlUAAAIlCAYAAAD8JA1zAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA3VpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDYuMC1jMDAyIDc5LjE2NDQ2MCwgMjAyMC8wNS8xMi0xNjowNDoxNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDphZGE3ZjkxMy04YThhLTQyMjEtODE0ZC0wYTNhMDAxNjFmNzIiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6ODQwQkQ2RDk4NzcyMTFFQzg3REY5MUFGNkZFMkFBMjEiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6ODQwQkQ2RDg4NzcyMTFFQzg3REY5MUFGNkZFMkFBMjEiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIDIxLjIgKE1hY2ludG9zaCkiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo3OGJjYTZmMi1lN2ZkLTRhNWQtOWE3Mi01YzZjYmU3ZTJmMDciIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6YWRhN2Y5MTMtOGE4YS00MjIxLTgxNGQtMGEzYTAwMTYxZjcyIi8+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"
        ></image>
      </defs>
    </SvgIcon>
  );
};

export const MomoIcon: React.FC<IconProps> = ({
  fillColor = "#a50064",
  ...props
}) => {
  return (
    <SvgIcon {...props} viewBox="0 0 296 296">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        fill={fillColor}
        d="M276,0H20C9,0,0,9,0,20v256c0,11,9,20,20,20h256c11,0,20-9,20-20V20C296,9,287,0,276,0z"
      />
      <g>
        <path
          fill="#FFFFFF"
          d="M204.8,139c23.5,0,42.5-19,42.5-42.5c0-23.5-19-42.5-42.5-42.5c-23.5,0-42.5,19-42.5,42.5
            C162.3,120,181.3,139,204.8,139z M204.8,78.4c10,0,18.1,8.1,18.1,18.1c0,10-8.1,18.1-18.1,18.1c-10,0-18.1-8.1-18.1-18.1
            C186.7,86.5,194.8,78.4,204.8,78.4z"
        />
        <path
          fill="#FFFFFF"
          d="M204.8,157.4c-23.5,0-42.5,19-42.5,42.5c0,23.5,19,42.5,42.5,42.5c23.5,0,42.5-19,42.5-42.5
            C247.3,176.4,228.3,157.4,204.8,157.4z M204.8,218c-10,0-18.1-8.1-18.1-18.1c0-10,8.1-18.1,18.1-18.1c10,0,18.1,8.1,18.1,18.1
            C222.9,209.9,214.8,218,204.8,218z"
        />
        <path
          fill="#FFFFFF"
          d="M118.2,157.4c-7.2,0-13.8,2.4-19.1,6.4c-5.3-4-12-6.4-19.1-6.4c-17.6,0-31.9,14.3-31.9,31.9v53.2h24.4V189
            c0-4,3.2-7.2,7.2-7.2c4,0,7.2,3.2,7.2,7.2v53.4h24.4V189c0-4,3.2-7.2,7.2-7.2c4,0,7.2,3.2,7.2,7.2v53.4H150v-53.2
            C150,171.7,135.8,157.4,118.2,157.4z"
        />
        <path
          fill="#FFFFFF"
          d="M118.2,54c-7.2,0-13.8,2.4-19.1,6.4c-5.3-4-12-6.4-19.1-6.4C62.3,54,48,68.3,48,85.9V139h24.4V85.6
            c0-4,3.2-7.2,7.2-7.2c4,0,7.2,3.2,7.2,7.2V139h24.4V85.6c0-4,3.2-7.2,7.2-7.2c4,0,7.2,3.2,7.2,7.2V139H150V85.9
            C150,68.3,135.8,54,118.2,54z"
        />
      </g>
    </SvgIcon>
  );
};

export const BreakfastIcon: React.FC<IconProps> = ({
  fillColor = "#48BB78",
  ...props
}) => {
  return (
    <SvgIcon {...props} viewBox="0 0 16 16" sx={{ fill: "none" }}>
      <path
        d="M11.31 11.976l1.862 1.862M3.241 3.908l4.966 4.965M4.483 2.667L7.586 5.77 5.103 8.253 2 5.149M3.241 13.838l10.552-10.55a5.036 5.036 0 01-1.242 4.965c-2.194 2.194-3.724 2.482-3.724 2.482"
        stroke={fillColor}
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></path>
    </SvgIcon>
  );
};

export const ConfirmIcon: React.FC<IconProps> = ({
  fillColor = "#ED8936",
  ...props
}) => {
  return (
    <SvgIcon {...props} viewBox="0 0 16 16" sx={{ fill: "none" }}>
      <path
        d="M12.739 6.478L6.652 15l1.217-5.478H3L9.087 1 7.87 6.478h4.87z"
        stroke={fillColor}
        strokeLinecap="round"
        strokeLinejoin="round"
      ></path>
    </SvgIcon>
  );
};
