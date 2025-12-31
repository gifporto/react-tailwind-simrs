import { CreditCard } from "lucide-react";
import { Badge } from "./ui/badge";

export default function BpjsBadge(bpjsNumber: number | string) {
  if (!bpjsNumber) {
    return <span>-</span>;
  }
  return (
    <Badge variant="success" className="gap-1 font-mono text-xs">
      <CreditCard className="w-3 h-3" />
      {bpjsNumber}
    </Badge>
  );
}
