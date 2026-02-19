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
        "border-2 border-dashed transition-all duration-200 cursor-pointer",
        "hover:shadow-md hover:-translate-y-0.5",
        "animate-fade-in-up",
        selected
          ? "border-km0-yellow-500 bg-km0-yellow-50 shadow-md"
          : "border-km0-yellow-500"
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
          "text-xl flex-shrink-0 transition-colors",
          selected ? "text-km0-yellow-600" : "text-km0-blue-300"
        )}
      >
        →
      </span>
    </button>
  );
};

export default LanguageCard;
