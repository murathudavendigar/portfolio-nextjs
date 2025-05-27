import { format, parse, differenceInMonths } from "date-fns";

export function formatExperienceDates(start: string, end?: string) {
  const currentDate = new Date();

  const parseDate = (str: string): Date => {
    return parse(str, "MMM yyyy", new Date());
  };

  const startDate = parseDate(start);
  const endDate =
    end && end.toLowerCase() !== "present" ? parseDate(end) : currentDate;

  const formattedStart = format(startDate, "MMM yyyy");
  const formattedEnd =
    end && end.toLowerCase() !== "present"
      ? format(endDate, "MMM yyyy")
      : "Present";

  const monthsDiff = differenceInMonths(endDate, startDate);
  const years = Math.floor(monthsDiff / 12);
  const months = monthsDiff % 12;

  let duration = "";
  if (years > 0) duration += `${years} yr${years > 1 ? "s" : ""}`;
  if (months > 0)
    duration += `${years > 0 ? " " : ""}${months} mo${months > 1 ? "s" : ""}`;

  return `${formattedStart} - ${formattedEnd} (${duration})`;
}
