import axios from "axios";
import config from "./config";

export default {
  async tables() {
    const result = await axios.get(`${config.mount_point}/tables`);
    return result.data.tables;
  },
};
