declare module 'react-player' {
    import * as React from 'react';
    
    interface ReactPlayerProps {
      url: string;
      playing?: boolean;
      loop?: boolean;
      controls?: boolean;
      light?: boolean | string;
      volume?: number;
      muted?: boolean;
      width?: string;
      height?: string;
      style?: React.CSSProperties;
      config?: {
        file?: {
          attributes?: {
            controlsList?: string;
          };
          forceVideo?: boolean;
        };
      };
      wrapper?: React.ComponentType<{ children: React.ReactNode }>;
      onDuration?: (duration: number) => void;
      onProgress?: (state: { played: number; loaded: number }) => void;
      onPlay?: () => void;
      onPause?: () => void;
      onClickPreview?: () => void;
    }
  
    const ReactPlayer: React.ForwardRefExoticComponent<
      ReactPlayerProps & React.RefAttributes<HTMLVideoElement>
    >;
    
    export default ReactPlayer;
  }