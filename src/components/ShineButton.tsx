import { ArrowUpRight } from "lucide-react";

interface ShineButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  className?: string;
}

export default function ShineButton({
  className,
  onClick,
  label = "Start Building",
  ...props
}: ShineButtonProps) {
  return (
    <button
      onClick={onClick}
      className={
        `relative h-10 px-4 overflow-hidden ` +
        `bg-zinc-900 dark:bg-zinc-100 ` +
        `transition-all duration-200 ` +
        `group ` +
        `rounded-full ` + // Added to make the button rounded
        className
      }
      {...props}
    >
      {/* Gradient background effect */}
      <div
        className={
          `absolute inset-0 ` +
          `bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 ` +
          `opacity-40 group-hover:opacity-80 ` +
          `blur-[2.5px] transition-opacity duration-500`
        }
      />

      {/* Content */}
      <div className="relative flex items-center justify-center gap-2">
        <span className="text-white dark:text-zinc-900">{label}</span>
        <ArrowUpRight className="w-3.5 h-3.5 text-white/90 dark:text-zinc-900/90" />
      </div>
    </button>
  );
}
