import React from 'react';
import { DayPicker } from 'react-day-picker';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';
import 'react-day-picker/dist/style.css';

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function EnhancedCalendar({
  className,
  classNames,
  showOutsideDays = true,
  numberOfMonths = 2,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      numberOfMonths={numberOfMonths}
      showOutsideDays={showOutsideDays}
      className={cn(
        "p-6 pointer-events-auto w-full h-full",
        "bg-gradient-to-br from-card via-card to-muted/20",
        "rounded-xl border border-primary/20 shadow-lg",
        className
      )}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0 flex-1 justify-center",
        month: "space-y-4 flex-1",
        caption: "flex justify-center pt-1 relative items-center mb-4",
        caption_label: "text-lg font-semibold text-foreground",
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-8 w-8 bg-transparent p-0 hover:bg-primary/20 hover:text-primary border-primary/30"
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex mb-2",
        head_cell: "text-muted-foreground rounded-md w-full font-semibold text-sm h-12 flex items-center justify-center",
        row: "flex w-full mt-2",
        cell: cn(
          "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-primary/10 [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected].day-range-end)]:rounded-r-md",
          "h-16 w-full flex items-center justify-center hover:bg-muted/50 transition-colors rounded-lg border border-transparent hover:border-primary/20"
        ),
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-14 w-14 p-0 font-normal text-base hover:bg-primary/20 hover:text-primary hover:scale-105 transition-all duration-200",
          "aria-selected:opacity-100 aria-selected:bg-primary aria-selected:text-primary-foreground aria-selected:shadow-md"
        ),
        day_range_start: "day-range-start rounded-l-md",
        day_range_end: "day-range-end rounded-r-md",
        day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground shadow-lg transform scale-105",
        day_today: "bg-accent text-accent-foreground font-bold ring-2 ring-primary/50",
        day_outside: "text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
        day_disabled: "text-muted-foreground opacity-50 cursor-not-allowed",
        day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: ({ ...props }) => <ChevronLeft className="h-4 w-4" />,
        IconRight: ({ ...props }) => <ChevronRight className="h-4 w-4" />,
      }}
      {...props}
    />
  );
}

EnhancedCalendar.displayName = "EnhancedCalendar";

export { EnhancedCalendar };