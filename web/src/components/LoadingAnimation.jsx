function LoadingAnimation({ label = "Loading..." }) {
  return (
    <div className="flex items-center gap-3 text-sm text-slate-600">
      <span className="inline-flex h-3 w-3 animate-ping rounded-full bg-red-500" />
      <span>{label}</span>
    </div>
  );
}

export default LoadingAnimation;
