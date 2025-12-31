import { format, parseISO } from "date-fns";
import { id as localeID } from "date-fns/locale";

export const formatDateSafely = (
  dateString: string | undefined | null,
  formatStr: string
) => {
  if (!dateString) return "-";
  try {
    return format(parseISO(dateString), formatStr, { locale: localeID });
  } catch (e) {
    return "-";
  }
};
