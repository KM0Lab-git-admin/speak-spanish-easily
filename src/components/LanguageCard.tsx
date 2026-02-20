import { cn } from "@/lib/utils";

interface LanguageCardProps {
  flag: string;
  flagIsImage?: boolean;
  name: string;
  description: string;
  selected?: boolean;
  onClick?: () => void;
  style?: React.CSSProperties;
}

const LanguageCard = ({
  flag,
  flagIsImage = false,
  name,
  description,
  selected = false,
  onClick,
  style
}: LanguageCardProps) => {
  return (
    <button
      onClick={onClick}
      style={style}
      className={cn(
        "w-full flex items-center gap-4 px-4 py-4 rounded-2xl bg-card text-left group border-[3px] border-solid",
        "transition-all duration-300 ease-out cursor-pointer animate-fade-in-up shadow-xl",
        "hover:scale-[1.06] hover:-translate-y-2 hover:shadow-[0_12px_32px_-6px_hsl(var(--km0-blue-700)/0.25)] hover:border-km0-yellow-500 hover:bg-km0-yellow-50",
        selected
          ? "border-km0-yellow-500 bg-km0-yellow-50 scale-[1.03] -translate-y-1 shadow-[0_12px_32px_-6px_hsl(var(--km0-blue-700)/0.2)]"
          : "border-km0-blue-700"
      )}>

      {/* Flag */}
      <span
        className={cn(
          "flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-full overflow-hidden transition-all duration-300",
          "bg-km0-beige-50 group-hover:bg-km0-yellow-100 group-hover:scale-110",
          selected ? "bg-km0-yellow-100 scale-110" : ""
        )}
        role="img"
        aria-label={name}>

        {flagIsImage ?
        <img
          src={flag}
          alt={`${name} flag`}
          className="w-9 h-9 object-cover rounded-full" /> :


        <span className="text-3xl">{flag}</span>
        }
      </span>

      {/* Text */}
      <div className="flex-1 min-w-0">
        <p className="font-ui font-semibold text-lg text-primary leading-tight">
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
          "group-hover:text-km0-yellow-500 group-hover:translate-x-1",
          selected ? "text-km0-yellow-500 translate-x-1" : "text-km0-blue-300"
        )}>

        →
      </span>
    </button>);

};

export default LanguageCard;