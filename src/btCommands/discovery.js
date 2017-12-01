import { execSync } from "child_process";

export default (params) => {
    return execSync("btdiscovery").toString()
  }