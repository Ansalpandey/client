import { ReactNode, useState, useContext, createContext, FC } from "react";
import { motion } from "framer-motion";
import { IconChevronDown } from "@tabler/icons-react";
import { twMerge } from "tailwind-merge";
import { cn } from "../utils/utils";

// Define types for props
interface AccordionProps {
  children: ReactNode;
  className?: string;
}

interface TabContextType {
  isOpen: boolean;
  setOpenState: React.Dispatch<React.SetStateAction<boolean>>;
}

interface TabProps {
  children: ReactNode;
  className?: string;
}

interface TriggerProps {
  children: ReactNode;
  className?: string;
}

interface ContentProps {
  children: ReactNode;
  className?: string;
}

// Accordion Component
export const Accordion: FC<AccordionProps> = ({ children, className }) => {
  return (
    <dl className={cn("flex flex-col items-start justify-start rounded-lg overflow-hidden", className)}>
      {children}
    </dl>
  );
};

// Create context with null as the initial value
const TabContext = createContext<TabContextType | null>(null);

// Tab Component
export const Tab: FC<TabProps> = ({ children, className }) => {
  const [isOpen, setOpenState] = useState(false);

  return (
    <TabContext.Provider value={{ isOpen, setOpenState }}>
      <div className={cn("bg-black w-full p-6 rounded-lg border-b border-gray-600", className)}>
        {children}
      </div>
    </TabContext.Provider>
  );
};

// Trigger Component
export const Trigger: FC<TriggerProps> = ({ children, className }) => {
  const context = useContext(TabContext);
  if (!context) {
    throw new Error("Trigger must be used within a Tab component");
  }

  const { setOpenState, isOpen } = context;

  return (
    <dt>
      <button
        aria-expanded={isOpen}
        onClick={() => setOpenState((e) => !e)}
        className={cn(
          "flex w-full items-center justify-between gap-2 text-start text-xl font-normal text-white",
          className
        )}
      >
        <span>{children}</span>
        <IconChevronDown
          size={20}
          className={twMerge(
            isOpen ? "rotate-180" : "rotate-0",
            "min-w-[20px] transition-all duration-300 text-white"
          )}
        />
      </button>
    </dt>
  );
};

// Content Component
export const Content: FC<ContentProps> = ({ children, className }) => {
  const context = useContext(TabContext);
  if (!context) {
    throw new Error("Content must be used within a Tab component");
  }

  const { isOpen } = context;

  return (
    <motion.dd
      layout
      aria-hidden={!isOpen}
      className={cn("overflow-hidden text-white", className)}
      initial={{ height: 0, pointerEvents: "none" }}
      animate={
        isOpen
          ? { height: "fit-content", pointerEvents: "auto", marginTop: "1rem" }
          : { height: 0, pointerEvents: "none" }
      }
      transition={{ duration: 0.2 }}
    >
      {children}
    </motion.dd>
  );
};
