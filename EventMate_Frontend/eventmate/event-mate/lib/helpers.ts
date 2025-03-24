import { format} from 'date-fns';
export const validatePassword = (password: string, confirmPassword: string) => {
    return {
      length: password.length >= 8 && password.length <= 32,
      uppercase: /[A-Z]/.test(password),
      number: /[0-9]/.test(password),
      specialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
      match: password === confirmPassword && password.length > 0,
    };
  };
  export const generateStartDateOfMonth = (currentDate: Date) => {
    const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1, 0, 0, 0, 0);
    const endDate = new Date(currentDate);
    return {
        value: {
            startDate,
            endDate,
        },
    };
};
export function hasTimezone(dateString: string) {
  return /([+-]\d{2}:\d{2})|(Z)$/.test(dateString);
}
export function fixMalformedTimezone(dateString: string) {
  // This regex looks for "+00x0" or any other incorrect formats
  return /([+-]\d{2})(\d{2})$/.test(dateString);
}
export function ensureTimezone(dateString: string) {
  if (hasTimezone(dateString)) {
      return dateString; // If it has a timezone
  } else if (fixMalformedTimezone(dateString)) {
      const date = new Date(dateString);
      return date.toISOString();
  } else {
      return dateString + '+00:00'; // Append +00:00 if no timezone is present
  }
}
export function timeConverter(
  UNIX_timestamp: Date,
  showHours: boolean = true,
  isShorten: boolean = false
) {
  const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
  ];
  const monthsShorten = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
  ];
  const year = UNIX_timestamp.getFullYear();
  let month = months[UNIX_timestamp.getMonth()];
  if (isShorten) month = monthsShorten[UNIX_timestamp.getMonth()];
  const date = UNIX_timestamp.getDate();
  const hour =
      UNIX_timestamp.getHours() >= 10
          ? UNIX_timestamp.getHours()
          : '0' + UNIX_timestamp.getHours();
  const min =
      UNIX_timestamp.getMinutes() >= 10
          ? UNIX_timestamp.getMinutes()
          : '0' + UNIX_timestamp.getMinutes();
  let result = date + ' ' + month + ' ' + year;
  if (showHours) {
      result = result + ', ' + hour + ':' + min;
  }
  return result;
}
export const formatLocalTime = (date?: string | Date, hasTimeZone: boolean = false) => {
  if (!date) return '';
  const reFormatDate: any = date || '';
  if (!hasTimeZone) return format(reFormatDate, "yyyy-MM-dd'T'HH:mm:ss'+00:00'");
  return format(reFormatDate, "yyyy-MM-dd'T'HH:mm:ss");
};

export const formatDateToYYYYMMDD = (dateString: string): string => {
  const date = new Date(dateString);

  // Extract the year, month, and day
  const year = date.getUTCFullYear();
  const month = (date.getUTCMonth() + 1).toString().padStart(2, '0'); // Month is zero-based, so +1
  const day = date.getUTCDate().toString().padStart(2, '0');

  // Format as YYYY/MM/DD
  return `${year}/${month}/${day} 23:59:59`;
};

export const formatDateToYYYYMMDDAndIncreaseDate = (dateString: string): string => {
  const date = new Date(dateString);
  // Increase the date by 1 day
  date.setDate(date.getDate() + 1);

  const year = date.getUTCFullYear();
  const month = (date.getUTCMonth() + 1).toString().padStart(2, '0'); // Month is 0-indexed, so add 1
  const day = date.getUTCDate().toString().padStart(2, '0');

  return `${year}/${month}/${day} 23:59:59`;
};
export const formatTimeOrDate = (date: string) =>  {
  const dateObj = new Date(date);
  const now = new Date();

  // Kiểm tra nếu cùng ngày
  if (
    now.getFullYear() === dateObj.getFullYear() &&
    now.getMonth() === dateObj.getMonth() &&
    now.getDate() === dateObj.getDate()
  ) {
    return dateObj.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  } else {
    return timeConverter(
      new Date(ensureTimezone(date)),
      false
    );
  }
}