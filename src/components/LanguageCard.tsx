import { cn } from "@/lib/utils";

interface LanguageCardProps {
  flag: string;
  flagIsImage?: boolean;
  name: string;
  description: string;
  selected?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  style?: React.CSSProperties;
}

const LanguageCard = ({
  flag,
  flagIsImage = false,
  name,
  description,
  selected = false,
  disabled = false,
  onClick,
  style
}: LanguageCardProps) => {
  return (
    <button
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      style={style}
      className={cn(
        "w-full flex items-center gap-4 px-4 py-4 rounded-2xl text-left group border-[2px] border-solid",
        "transition-all duration-300 ease-out animate-fade-in-up",
        disabled
          ? "bg-km0-beige-50 border-km0-blue-200 opacity-50 cursor-not-allowed grayscale"
          : cn(
              "bg-card cursor-pointer",
              "hover:scale-[1.06] hover:-translate-y-2 hover:shadow-[0_12px_32px_-6px_hsl(var(--km0-blue-700)/0.25)] hover:border-km0-yellow-500 hover:bg-km0-yellow-50",
              selected
                ? "border-km0-yellow-500 bg-km0-yellow-50 scale-[1.03] -translate-y-1 shadow-[0_12px_32px_-6px_hsl(var(--km0-blue-700)/0.2)]"
                : "border-km0-blue-700 shadow-xl"
            )
      )}>

      {/* Flag */}
      <span
        className={cn(
          "flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-full overflow-hidden transition-all duration-300",
          disabled
            ? "bg-km0-beige-100"
            : cn(
                "bg-km0-beige-50 group-hover:bg-km0-yellow-100 group-hover:scale-110",
                selected ? "bg-km0-yellow-100 scale-110" : ""
              )
        )}
        role="img"
        aria-label={name}>

        {flagIsImage
          ? <img src={flag} alt={`${name} flag`} className="w-9 h-9 object-cover rounded-full" />
          : <span className="text-3xl">{flag}</span>
        }
      </span>

      {/* Text */}
      <div className="flex-1 min-w-0">
        <p className={cn("font-ui font-semibold text-lg leading-tight", disabled ? "text-muted-foreground" : "text-primary")}>
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
          disabled
            ? "text-km0-blue-200"
            : cn(
                "group-hover:text-km0-yellow-500 group-hover:translate-x-1",
                selected ? "text-km0-yellow-500 translate-x-1" : "text-km0-blue-300"
              )
        )}>
        →
      </span>
    </button>
  );
};

export default LanguageCard;
