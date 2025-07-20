// types/react-plyr.d.ts
declare module "react-plyr" {
  import * as React from "react";
  export interface PlyrProps {
    source: unknown;
    options?: unknown;
    autoPlay?: boolean;
    poster?: string;
    children?: React.ReactNode;
    [key: string]: unknown;
  }
  export default class Plyr extends React.Component<PlyrProps> {}
}
