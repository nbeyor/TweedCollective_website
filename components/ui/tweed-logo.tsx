interface TweedLogoProps {
  animated?: boolean;
  size?: number;
  className?: string;
  withText?: boolean;
}

const TweedLogo = ({ animated = true, size = 80, className = "", withText = false }: TweedLogoProps) => {
  const logoClass = animated ? "tweed-logo-animated" : "tweed-logo-static";
  
  const LogoMark = (
    <div 
      className={`${logoClass} ${className} flex-shrink-0`}
      style={{ width: size, height: size }}
    >
      {animated ? (
        // 8 animated streams
        <>
          <div className="data-stream-h"></div>
          <div className="data-stream-h"></div>
          <div className="data-stream-h"></div>
          <div className="data-stream-h"></div>
          <div className="data-stream-v"></div>
          <div className="data-stream-v"></div>
          <div className="data-stream-v"></div>
          <div className="data-stream-v"></div>
        </>
      ) : (
        // 8 static lines + 4 intersection points
        <>
          <div className="static-line-h"></div>
          <div className="static-line-h"></div>
          <div className="static-line-h"></div>
          <div className="static-line-h"></div>
          <div className="static-line-v"></div>
          <div className="static-line-v"></div>
          <div className="static-line-v"></div>
          <div className="static-line-v"></div>
          <div className="weave-point"></div>
          <div className="weave-point"></div>
          <div className="weave-point"></div>
          <div className="weave-point"></div>
        </>
      )}
    </div>
  );

  if (withText) {
    return (
      <div className="flex items-center gap-3">
        {LogoMark}
        <span className="font-sans font-semibold text-lg tracking-tight text-charcoal">
          Tweed Collective
        </span>
      </div>
    );
  }

  return LogoMark;
};

export default TweedLogo;
