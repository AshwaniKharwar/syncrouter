export interface ModelMetadata {
  contextWindow: string;
  pricePerMillion: string;
  latencyTag: string;
}

export function getModelMetadata(slug?: string, _companyName?: string): ModelMetadata {
  const s = (slug || "").toLowerCase();

  if (s.includes("gpt-5.6-terra")) {
    return { contextWindow: "1M ctx", pricePerMillion: "$6.00/M", latencyTag: "~320ms latency" };
  }
  if (s.includes("gpt-5.6-sol")) {
    return { contextWindow: "512k ctx", pricePerMillion: "$4.00/M", latencyTag: "~210ms latency" };
  }
  if (s.includes("gpt-5.6-luna")) {
    return { contextWindow: "128k ctx", pricePerMillion: "$1.50/M", latencyTag: "~95ms latency" };
  }
  if (s.includes("gpt-5.5")) {
    return { contextWindow: "256k ctx", pricePerMillion: "$3.50/M", latencyTag: "~180ms latency" };
  }
  if (s.includes("gemini-3.6-flash")) {
    return { contextWindow: "1M ctx", pricePerMillion: "$1.10/M", latencyTag: "~90ms latency" };
  }
  if (s.includes("gemini-3.7")) {
    return { contextWindow: "2M ctx", pricePerMillion: "$2.25/M", latencyTag: "~160ms latency" };
  }
  if (s.includes("gemini-3.8")) {
    return { contextWindow: "2M ctx", pricePerMillion: "$3.00/M", latencyTag: "~220ms latency" };
  }
  if (s.includes("claude-haiku-4.5")) {
    return { contextWindow: "200k ctx", pricePerMillion: "$1.80/M", latencyTag: "~85ms latency" };
  }
  if (s.includes("claude-sonnet-4.5")) {
    return { contextWindow: "200k ctx", pricePerMillion: "$4.00/M", latencyTag: "~170ms latency" };
  }
  if (s.includes("claude-sonnet-4.6")) {
    return { contextWindow: "200k ctx", pricePerMillion: "$4.50/M", latencyTag: "~190ms latency" };
  }
  if (s.includes("claude-5")) {
    return { contextWindow: "200k ctx", pricePerMillion: "$6.00/M", latencyTag: "~310ms latency" };
  }
  if (s.includes("kimi")) {
    return { contextWindow: "128k ctx", pricePerMillion: "$1.60/M", latencyTag: "~140ms latency" };
  }
  if (s.includes("deepseek")) {
    return { contextWindow: "128k ctx", pricePerMillion: "$1.14/M", latencyTag: "~110ms latency" };
  }

  return { contextWindow: "128k ctx", pricePerMillion: "$2.00/M", latencyTag: "~150ms latency" };
}
