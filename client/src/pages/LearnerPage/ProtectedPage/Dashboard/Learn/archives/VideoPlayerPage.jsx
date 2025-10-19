import React, {
  useState,
  useRef,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import {
  Play,
  Pause,
  Rewind,
  FastForward,
  ChevronLeft,
  Maximize,
  Minimize,
  Volume2,
  VolumeX,
  Settings,
  Check,
  Captions,
} from "lucide-react";

// --- DUMMY DATA ---
const useVideoData = () => {
  const [data, setData] = useState(null);

  // Simulate an async data fetch
  useEffect(() => {
    const timer = setTimeout(() => {
      setData({
        content: {
          title: "State Management with useReducer",
          description:
            "A deep dive into one of React's most powerful hooks. Learn when and why to use `useReducer` over `useState` for managing complex component state, making your code cleaner and more predictable.",
          duration: "10 min",
          posterSrc: "https://i.ytimg.com/vi/kK_Wqx3RnHk/maxresdefault.jpg",
          sources: [
            {
              quality: "1080p",
              url: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
            },
            {
              quality: "720p",
              url: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
            },
          ],
          captions: [
            { lang: "en", label: "English", src: "path/to/captions.vtt" },
          ],
        },
      });
    }, 1500); // 1.5 second delay to simulate loading
    return () => clearTimeout(timer);
  }, []);

  return data || {}; // Return empty object initially
};

// =================================================================================
// --- ENHANCED VIDEO PLAYER COMPONENT ---
// =================================================================================
const PlatformVideoPlayer = forwardRef(({ content }, ref) => {
  // Add a guard clause for extra safety
  if (!content) {
    return null;
  }

  // --- STATE MANAGEMENT ---
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [activeMenu, setActiveMenu] = useState(null);
  const [currentQuality, setCurrentQuality] = useState(
    content.sources[0].quality
  );
  const [showControls, setShowControls] = useState(true);
  const [seekIndicator, setSeekIndicator] = useState({
    show: false,
    type: "forward",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [buffered, setBuffered] = useState(0);

  // --- REFS ---
  const videoRef = useRef(null);
  const playerContainerRef = useRef(null);
  const controlsTimeoutRef = useRef(null);
  const seekIndicatorTimeoutRef = useRef(null);

  const currentSource = content.sources.find(
    (s) => s.quality === currentQuality
  )?.url;

  // --- IMPERATIVE HANDLE ---
  useImperativeHandle(ref, () => ({
    togglePlayPause,
    seekForward: () => seek(5),
    seekRewind: () => seek(-5),
  }));

  // --- EFFECTS ---
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateProgress = () => {
      setProgress((video.currentTime / video.duration) * 100);
      setCurrentTime(video.currentTime);
    };
    const setVideoDuration = () => setDuration(video.duration);
    const handleWaiting = () => setIsLoading(true);
    const handlePlaying = () => setIsLoading(false);
    const updateBuffered = () => {
      if (video.buffered.length > 0 && video.duration > 0) {
        const bufferedEnd = video.buffered.end(video.buffered.length - 1);
        const bufferedPercentage = (bufferedEnd / video.duration) * 100;
        setBuffered(bufferedPercentage);
      }
    };

    video.addEventListener("timeupdate", updateProgress);
    video.addEventListener("loadedmetadata", setVideoDuration);
    video.addEventListener("play", () => setIsPlaying(true));
    video.addEventListener("pause", () => setIsPlaying(false));
    video.addEventListener("waiting", handleWaiting);
    video.addEventListener("playing", handlePlaying);
    video.addEventListener("progress", updateBuffered);

    return () => {
      video.removeEventListener("timeupdate", updateProgress);
      video.removeEventListener("loadedmetadata", setVideoDuration);
      video.removeEventListener("play", () => setIsPlaying(true));
      video.removeEventListener("pause", () => setIsPlaying(false));
      video.removeEventListener("waiting", handleWaiting);
      video.removeEventListener("playing", handlePlaying);
      video.removeEventListener("progress", updateBuffered);
    };
  }, []);

  // --- HANDLER FUNCTIONS ---
  const handleQualityChange = (newQuality) => {
    if (videoRef.current) {
      const wasPlaying = !videoRef.current.paused;
      const time = videoRef.current.currentTime;
      setCurrentQuality(newQuality);
      videoRef.current.onloadeddata = () => {
        videoRef.current.currentTime = time;
        if (wasPlaying) videoRef.current.play();
      };
    }
    setActiveMenu(null);
  };

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    if (isPlaying) {
      controlsTimeoutRef.current = setTimeout(
        () => setShowControls(false),
        3000
      );
    }
  };

  const togglePlayPause = () => {
    if (videoRef.current) {
      videoRef.current.paused
        ? videoRef.current.play()
        : videoRef.current.pause();
    }
  };

  const seek = (seconds) => {
    if (videoRef.current) {
      videoRef.current.currentTime += seconds;
      setSeekIndicator({
        show: true,
        type: seconds > 0 ? "forward" : "rewind",
      });
      if (seekIndicatorTimeoutRef.current)
        clearTimeout(seekIndicatorTimeoutRef.current);
      seekIndicatorTimeoutRef.current = setTimeout(
        () => setSeekIndicator({ show: false, type: "forward" }),
        700
      );
    }
  };

  const handleSeekSlider = (e) => {
    if (duration > 0) {
      const seekTime =
        (e.nativeEvent.offsetX /
          e.currentTarget.closest(".progress-bar-container").clientWidth) *
        duration;
      videoRef.current.currentTime = seekTime;
    }
  };

  const handleVolumeChange = (e) => {
    const newVol = parseFloat(e.target.value);
    setVolume(newVol);
    setIsMuted(newVol === 0);
    videoRef.current.volume = newVol;
  };

  const handlePlaybackRateChange = (rate) => {
    setPlaybackRate(rate);
    videoRef.current.playbackRate = rate;
    setActiveMenu(null);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      playerContainerRef.current.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  const formatTime = (time) =>
    new Date(time * 1000).toISOString().substr(14, 5);

  // --- RENDER ---
  return (
    <div
      ref={playerContainerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => isPlaying && setShowControls(false)}
      className="relative w-full aspect-video bg-black rounded-xl overflow-hidden shadow-2xl group"
    >
      <video
        ref={videoRef}
        src={currentSource}
        poster={content.posterSrc}
        className="w-full h-full object-cover"
      />

      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
          <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      <div
        onClick={togglePlayPause}
        className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${
          isPlaying || isLoading
            ? "opacity-0 bg-black/0"
            : "opacity-100 bg-black/40"
        } cursor-pointer`}
      >
        {!isPlaying && !isLoading && (
          <div className="text-center text-white select-none">
            <h2 className="text-4xl font-bold drop-shadow-lg">
              {content.title}
            </h2>
            <div className="flex justify-center items-center gap-12 mt-8">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  seek(-10);
                }}
                className="p-3 rounded-full hover:bg-white/20 transition-colors"
              >
                <Rewind size={32} />
              </button>
              <button className="p-4 rounded-full hover:bg-white/20 transition-transform hover:scale-110">
                <Play size={64} className="ml-2" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  seek(10);
                }}
                className="p-3 rounded-full hover:bg-white/20 transition-colors"
              >
                <FastForward size={32} />
              </button>
            </div>
          </div>
        )}
      </div>

      <div
        className={`absolute inset-0 flex items-center justify-center transition-opacity duration-200 pointer-events-none ${
          seekIndicator.show ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="bg-black/60 p-4 rounded-full text-white flex items-center gap-2">
          {seekIndicator.type === "forward" ? (
            <FastForward size={24} />
          ) : (
            <Rewind size={24} />
          )}
          <span className="text-lg font-semibold">5s</span>
        </div>
      </div>

      <div
        className={`absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent transition-opacity duration-300 ${
          showControls ? "opacity-100" : "opacity-0"
        }`}
      >
        <div
          onClick={handleSeekSlider}
          className="w-full h-1.5 bg-white/30 rounded-full cursor-pointer group/progress mb-2 relative progress-bar-container"
        >
          <div
            className="absolute h-full bg-white/50 rounded-full"
            style={{ width: `${buffered}%` }}
          />
          <div
            className="h-full bg-blue-500 rounded-full relative"
            style={{ width: `${progress}%` }}
          >
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-blue-500 rounded-full" />
          </div>
        </div>

        <div className="flex items-center justify-between text-white">
          <div className="flex items-center gap-4">
            <button onClick={togglePlayPause}>
              {isPlaying ? <Pause size={20} /> : <Play size={20} />}
            </button>
            <button onClick={() => seek(-10)}>
              <Rewind size={20} />
            </button>
            <button onClick={() => seek(10)}>
              <FastForward size={20} />
            </button>
            <div className="flex items-center gap-2 group/volume relative">
              <button onClick={() => setIsMuted(!isMuted)} className="p-1">
                {isMuted || volume === 0 ? (
                  <VolumeX size={20} />
                ) : (
                  <Volume2 size={20} />
                )}
              </button>
              <input
                type="range"
                min={0}
                max={1}
                step={0.0001}
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-0 group-hover/volume:w-24 transition-all duration-300 h-1 rounded-lg appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #3b82f6 ${
                    isMuted ? 0 : volume * 100
                  }%, #9ca3af ${isMuted ? 0 : volume * 100}%)`,
                }}
              />
            </div>
            <span className="font-light text-sm">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>
          <div className="flex items-center gap-4 relative">
            <button>
              <Captions size={20} />
            </button>
            <button
              onClick={() =>
                setActiveMenu(activeMenu === "settings" ? null : "settings")
              }
            >
              <Settings size={20} />
            </button>
            <button onClick={toggleFullscreen}>
              {document.fullscreenElement ? (
                <Minimize size={20} />
              ) : (
                <Maximize size={20} />
              )}
            </button>
            {activeMenu === "settings" && (
              <div className="absolute bottom-full right-0 mb-4 bg-black/80 backdrop-blur-md rounded-lg text-white text-sm w-48 overflow-hidden">
                <button
                  onClick={() => setActiveMenu("quality")}
                  className="w-full flex justify-between items-center p-3 hover:bg-white/10"
                >
                  <span>Quality</span>
                  <span className="text-white/70">{currentQuality} &gt;</span>
                </button>
                <button
                  onClick={() => setActiveMenu("speed")}
                  className="w-full flex justify-between items-center p-3 hover:bg-white/10"
                >
                  <span>Speed</span>
                  <span className="text-white/70">{playbackRate}x &gt;</span>
                </button>
              </div>
            )}
            {activeMenu === "quality" && (
              <div className="absolute bottom-full right-0 mb-4 bg-black/80 backdrop-blur-md rounded-lg text-white text-sm w-48 overflow-hidden">
                <button
                  onClick={() => setActiveMenu("settings")}
                  className="w-full text-left p-3 hover:bg-white/10 text-white/70"
                >
                  &lt; Quality
                </button>
                <div className="border-t border-white/20 my-1"></div>
                {content.sources.map((s) => (
                  <button
                    key={s.quality}
                    onClick={() => handleQualityChange(s.quality)}
                    className="w-full flex items-center gap-3 text-left p-3 hover:bg-white/10"
                  >
                    <Check
                      size={16}
                      className={
                        currentQuality === s.quality
                          ? "opacity-100"
                          : "opacity-0"
                      }
                    />
                    <span>{s.quality}</span>
                  </button>
                ))}
              </div>
            )}
            {activeMenu === "speed" && (
              <div className="absolute bottom-full right-0 mb-4 bg-black/80 backdrop-blur-md rounded-lg text-white text-sm w-48 overflow-hidden">
                <button
                  onClick={() => setActiveMenu("settings")}
                  className="w-full text-left p-3 hover:bg-white/10 text-white/70"
                >
                  &lt; Speed
                </button>
                <div className="border-t border-white/20 my-1"></div>
                {[0.5, 1, 1.5, 2].map((r) => (
                  <button
                    key={r}
                    onClick={() => handlePlaybackRateChange(r)}
                    className="w-full flex items-center gap-3 text-left p-3 hover:bg-white/10"
                  >
                    <Check
                      size={16}
                      className={
                        playbackRate === r ? "opacity-100" : "opacity-0"
                      }
                    />
                    <span>{r === 1 ? "Normal" : `${r}x`}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});

// =================================================================================
// --- MAIN PAGE COMPONENT (WITH CRASH FIX) ---
// =================================================================================
export default function PlatformPlayerPage() {
  const { content } = useVideoData();
  const playerRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === "INPUT") return;
      if (["Space", "ArrowLeft", "ArrowRight"].includes(e.code))
        e.preventDefault();
      if (playerRef.current) {
        switch (e.code) {
          case "Space":
            playerRef.current.togglePlayPause();
            break;
          case "ArrowRight":
            playerRef.current.seekForward();
            break;
          case "ArrowLeft":
            playerRef.current.seekRewind();
            break;
          default:
            break;
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="bg-neutral-100 min-h-screen text-neutral-800 p-4 sm:p-6 lg:p-8">
      <div className="max-w-5xl mx-auto">
        <button
          onClick={() => alert("Navigate back to course...")}
          className="flex items-center gap-1.5 text-sm text-neutral-500 hover:text-blue-600 font-light transition-colors mb-4"
        >
          <ChevronLeft size={16} />
          Back to Course
        </button>

        {content ? (
          <>
            <PlatformVideoPlayer ref={playerRef} content={content} />
            <div className="mt-8 bg-white rounded-xl shadow-sm border border-neutral-200/80 p-8">
              <h1 className="text-3xl font-normal tracking-tight text-neutral-900">
                {content.title}
              </h1>
              <div className="flex items-center gap-4 mt-2 text-neutral-500 font-light text-sm">
                <span>{content.duration}</span>
              </div>
              <p className="mt-6 font-light leading-relaxed text-neutral-600">
                {content.description}
              </p>
            </div>
          </>
        ) : (
          <>
            <div className="w-full aspect-video bg-neutral-200 rounded-xl flex items-center justify-center animate-pulse">
              <p className="text-neutral-500">Loading Player...</p>
            </div>
            <div className="mt-8 bg-white rounded-xl p-8 animate-pulse">
              <div className="h-8 bg-neutral-200 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-neutral-200 rounded w-1/4 mb-6"></div>
              <div className="h-4 bg-neutral-200 rounded w-full mb-2"></div>
              <div className="h-4 bg-neutral-200 rounded w-full mb-2"></div>
              <div className="h-4 bg-neutral-200 rounded w-5/6"></div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
