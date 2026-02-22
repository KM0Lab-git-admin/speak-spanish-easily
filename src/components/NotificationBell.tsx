interface NotificationBellProps {
  hasAlerts?: boolean;
  className?: string;
}

const NotificationBell = ({ hasAlerts = false, className = "" }: NotificationBellProps) => (
  <div className={`relative w-10 h-10 flex items-center justify-center ${className}`}>
    {/* Bell SVG */}
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="text-km0-blue-800"
    >
      <path
        d="M12 2V3M12 3C8.69 3 6 5.69 6 9V13L4 17H20L18 13V9C18 5.69 15.31 3 12 3Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10 20C10 21.1 10.9 22 12 22C13.1 22 14 21.1 14 20"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>

    {/* Alert dot — separate from bell */}
    <span
      className={`absolute top-0.5 right-0.5 w-3 h-3 rounded-full border-2 border-white transition-colors ${
        hasAlerts ? "bg-km0-coral-400" : "bg-km0-beige-200"
      }`}
    />
  </div>
);

export default NotificationBell;
