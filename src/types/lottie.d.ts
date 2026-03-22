/// <reference types="react" />

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'dotlottie-player': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        src?: string;
        autoplay?: boolean;
        loop?: boolean;
        speed?: string | number;
        mode?: string;
        background?: string;
        style?: React.CSSProperties;
        className?: string;
      };
    }
  }
}

export {};
