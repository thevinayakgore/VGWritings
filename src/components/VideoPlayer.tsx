"use client";
import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  FaPlay,
  FaPause,
  FaExpand,
  FaCompress,
  FaVolumeMute,
  FaVolumeUp,
} from "react-icons/fa";
import { MdSettings, MdClosedCaption } from "react-icons/md";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface VideoPlayerProps {
  src: string;
  poster?: string;
}

const formatTime = (seconds: number) =>
  isNaN(seconds)
    ? "0:00"
    : `${Math.floor(seconds / 60)}:${("0" + Math.floor(seconds % 60)).slice(-2)}`;

const VideoPlayer: React.FC<VideoPlayerProps> = ({ src, poster }) => {
  const [playing, setPlaying] = useState(false);
  const [showInitialPlayButton, setShowInitialPlayButton] = useState(true);
  const [showPauseOverlay, setShowPauseOverlay] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const [progress, setProgress] = useState(0);
  const [buffered, setBuffered] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const controlsTimeout = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const pauseTimeout = useRef<NodeJS.Timeout | null>(null);

  const toggleFullscreen = useCallback(() => {
    if (!containerRef.current) return;
    if (!fullscreen) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen();
      }
      setFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
      setFullscreen(false);
    }
  }, [fullscreen]);

  // Show controls on mouse move, hide after 3s
  const showControlsTemporarily = () => {
    setShowControls(true);
    if (controlsTimeout.current) clearTimeout(controlsTimeout.current);
    controlsTimeout.current = setTimeout(() => {
      setShowControls(false);
    }, 3000);
  };

  useEffect(() => {
    return () => {
      if (controlsTimeout.current) clearTimeout(controlsTimeout.current);
      if (pauseTimeout.current) clearTimeout(pauseTimeout.current);
    };
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!videoRef.current) return;
      switch (e.key) {
        case " ":
          e.preventDefault();
          togglePlayPause();
          break;
        case "ArrowRight":
          videoRef.current.currentTime += 5;
          break;
        case "ArrowLeft":
          videoRef.current.currentTime -= 5;
          break;
        case "f":
        case "F":
          toggleFullscreen();
          break;
        case "m":
        case "M":
          setMuted((m) => !m);
          break;
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggleFullscreen]);

  const togglePlayPause = () => {
    if (!videoRef.current) return;

    if (videoRef.current.paused) {
      videoRef.current.play().catch((e) => console.error("Play failed:", e));
      setPlaying(true);
      setShowInitialPlayButton(false);
    } else {
      videoRef.current.pause();
      setPlaying(false);
      setShowPauseOverlay(true);
      if (pauseTimeout.current) clearTimeout(pauseTimeout.current);
      pauseTimeout.current = setTimeout(() => {
        setShowPauseOverlay(false);
      }, 600);
    }
  };

  const handleProgressClick = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    if (!videoRef.current || !progressBarRef.current) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    videoRef.current.currentTime = percent * duration;
  };

  const handleVolumeChange = (value: number[]) => {
    const v = value[0];
    setVolume(v);
    setMuted(v === 0);
    if (videoRef.current) {
      videoRef.current.volume = v;
      videoRef.current.muted = v === 0;
    }
  };

  const handleVolumeButtonClick = () => {
    if (muted) {
      setMuted(false);
      setVolume(volume === 0 ? 0.5 : volume);
    } else {
      setMuted(true);
    }
  };

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = volume;
      videoRef.current.muted = muted;
    }
  }, [volume, muted]);

  return (
    <div
      ref={containerRef}
      className="relative w-full aspect-video my-6 md:my-12 group overflow-hidden rounded-lg border border-white/10"
      onMouseMove={showControlsTemporarily}
      onClick={togglePlayPause}
      tabIndex={0}
    >
      {/* Persistent Info Box at the top */}
      <div className="absolute top-0 left-0 w-full bg-black/50 backdrop-blur-sm py-2 px-5 z-10">
        <div className="text-white text-xs">
          <p>
            Press{" "}
            <span className="font-mono bg-white/30 backdrop-blur-lg px-1 rounded">
              Space
            </span>{" "}
            to play/pause •{" "}
            <span className="font-mono bg-white/30 backdrop-blur-lg px-1 rounded">
              ← →
            </span>{" "}
            to seek •{" "}
            <span className="font-mono bg-white/30 backdrop-blur-lg px-1 rounded">
              F
            </span>{" "}
            for fullscreen
          </p>
        </div>
      </div>
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        className="w-full h-full object-cover cursor-pointer"
        playsInline
        disablePictureInPicture
        disableRemotePlayback
        onTimeUpdate={() => {
          if (!videoRef.current) return;
          setCurrentTime(videoRef.current.currentTime);
          setProgress((videoRef.current.currentTime / duration) * 100);

          if (videoRef.current.buffered.length > 0) {
            const bufferedEnd = videoRef.current.buffered.end(
              videoRef.current.buffered.length - 1
            );
            setBuffered((bufferedEnd / duration) * 100);
          }
        }}
        onLoadedMetadata={() => {
          if (videoRef.current) setDuration(videoRef.current.duration);
        }}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        controls={false}
      />

      {/* Initial play button */}
      {showInitialPlayButton && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute inset-0 m-auto w-16 h-16 rounded-full bg-black/30 hover:bg-black/40 backdrop-blur-sm"
          onClick={(e) => {
            e.stopPropagation();
            togglePlayPause();
          }}
        >
          <FaPlay className="w-10 h-10 text-white" />
        </Button>
      )}

      {/* Pause overlay */}
      {showPauseOverlay && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="p-8 bg-black/30 text-white rounded-full backdrop-blur-sm">
            <FaPause className="size-10" />
          </div>
        </div>
      )}

      {/* Controls bar */}
      <div
        className={`absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/80 to-transparent p-2 transition-opacity duration-300 ${showControls ? "opacity-100" : "opacity-0"}`}
      >
        {/* Progress Bar */}
        <div
          ref={progressBarRef}
          className="w-full h-2 bg-gray-700 rounded cursor-pointer relative mb-2"
          onClick={handleProgressClick}
        >
          <div
            className="absolute h-2 bg-gray-500 rounded"
            style={{ width: `${buffered}%` }}
          />
          <div
            className="absolute h-2 bg-blue-500 rounded"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex items-center justify-between gap-2 px-2">
          <div className="flex items-center gap-4">
            {/* Play/Pause */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:text-white hover:bg-white/10"
                  onClick={(e) => {
                    e.stopPropagation();
                    togglePlayPause();
                  }}
                >
                  {playing ? (
                    <FaPause className="size-5" />
                  ) : (
                    <FaPlay className="size-5" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent container={containerRef.current}>
                {playing ? "Pause (k)" : "Play (k)"}
              </TooltipContent>
            </Tooltip>

            {/* Volume */}
            <div className="flex items-center gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:text-white hover:bg-white/10"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleVolumeButtonClick();
                    }}
                  >
                    {muted || volume === 0 ? (
                      <FaVolumeMute className="size-5" />
                    ) : (
                      <FaVolumeUp className="size-5" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent container={containerRef.current}>
                  {muted || volume === 0 ? "Unmute (m)" : "Mute (m)"}
                </TooltipContent>
              </Tooltip>
              <div className="relative w-24">
                <div
                  className="absolute h-1.5 rounded-full bg-blue-500"
                  style={{ width: `${(muted ? 0 : volume) * 100}%` }}
                />
                <Slider
                  defaultValue={[volume]}
                  value={[muted ? 0 : volume]}
                  max={1}
                  step={0.01}
                  onValueChange={handleVolumeChange}
                  className="w-24 h-1.5 [&>span[data-orientation=horizontal]>span]:bg-blue-500"
                  onPointerDown={(e) => e.stopPropagation()}
                />
              </div>
            </div>

            {/* Time */}
            <span className="text-xs text-white font-mono">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Closed Captions */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:text-white hover:bg-white/10"
                >
                  <MdClosedCaption className="size-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent container={containerRef.current}>
                Subtitles/CC (c)
              </TooltipContent>
            </Tooltip>

            {/* Settings */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:text-white hover:bg-white/10"
                >
                  <MdSettings className="size-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent container={containerRef.current}>
                Settings
              </TooltipContent>
            </Tooltip>

            {/* Fullscreen */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:text-white hover:bg-white/10"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFullscreen();
                  }}
                >
                  {fullscreen ? (
                    <FaCompress className="size-5" />
                  ) : (
                    <FaExpand className="size-5" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent container={containerRef.current}>
                {fullscreen ? "Exit fullscreen (f)" : "Fullscreen (f)"}
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
