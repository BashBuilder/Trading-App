import { TierCapability } from "@/config/tier";
import { useState } from "react";
import {
  runAdvancedIndicatorScan,
  runAnalyticsScan,
  runCoreSignalScan,
} from "./trading.engine";

export function useTrading(capabilities: TierCapability[]) {
  const [results, setResults] = useState<any[]>([]);

  function runScan() {
    const output = [];

    if (capabilities.includes("coreSignals")) {
      output.push(...runCoreSignalScan());
    }

    if (capabilities.includes("advancedIndicators")) {
      output.push(...runAdvancedIndicatorScan());
    }

    if (capabilities.includes("analytics")) {
      output.push(...runAnalyticsScan());
    }

    setResults(output);
  }

  return {
    results,
    runScan,
  };
}
