import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { TimePicker } from "antd";

dayjs.extend(customParseFormat);

const TimePicer = ({ id, time, handleFunction }) => {
  const timeValue = time ? dayjs(time, "h:mm a") : null;
  return (
    <TimePicker
      value={timeValue}
      use12Hours
      format="h:mm a"
      onChange={(time, timeString) => handleFunction(id, time, timeString)}
    />
  );
};
export default TimePicer;
