import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { useCallback } from "react";

interface DatePickerProps {
  onChange(date: Date): void;
  value: Date;
  close(): void;
  show: boolean;
}

export function DatePicker({
  onChange,
  value = new Date(),
  close,
  show,
}: DatePickerProps) {
  const handleDateChange = useCallback(
    (ev: DateTimePickerEvent, val?: Date) => {
      switch (ev.type) {
        case "set":
          if (val) {
            onChange(val);
          } else {
            console.warn("selectedDate is undefined");
          }
          close();
          break;
        case "neutralButtonPressed":
          break;
        case "dismissed":
          close();
          break;
        default:
          break;
      }
    },
    []
  );

  return show ? (
    <DateTimePicker
      mode="date"
      display="calendar"
      value={value}
      onChange={handleDateChange}
    />
  ) : null;
}
