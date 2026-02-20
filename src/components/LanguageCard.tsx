import { cn } from "@/lib/utils";

interface LanguageCardProps {
  flag: string;
  name: string;
  description: string;
  selected?: boolean;
  onClick?: () => void;
  style?: React.CSSProperties;
}

const LanguageCard = ({
  flag,
  name,
  description,
  selected = false,
  onClick,
  style,
}: LanguageCardProps) => {
  return (
    <button
      onClick={onClick}
      style={style}
      className={cn(
        "w-full flex items-center gap-4 px-4 py-4 rounded-2xl bg-card text-left",
        "border-2 transition-all duration-200 cursor-pointer",
        "hover:shadow-lg hover:-translate-y-0.5 hover:border-km0-blue-700 hover:bg-km0-blue-50",
        "active:scale-95 active:shadow-sm",
        "animate-fade-in-up",
        selected
          ? "border-km0-blue-700 bg-km0-blue-50 shadow-md"
          : "border-km0-blue-300"
      )}
    >
      {/* Flag */}
      <span
        className="text-3xl flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-full bg-km0-beige-50"
        role="img"
        aria-label={name}
      >
        {flag}
      </span>

      {/* Text */}
      <div className="flex-1 min-w-0">
        <p className="font-ui font-semibold text-base text-primary leading-tight">
          {name}
        </p>
        <p className="font-body text-sm text-muted-foreground mt-0.5">
          {description}
        </p>
      </div>

      {/* Arrow */}
      <span
        className={cn(
          "text-xl flex-shrink-0 transition-all duration-200",
          selected ? "text-km0-blue-700 translate-x-1" : "text-km0-blue-300"
        )}
      >
        →
      </span>
    </button>
  );
};

export default LanguageCard;
