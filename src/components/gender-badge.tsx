import { Mars, Venus } from "lucide-react";
import { Badge } from "./ui/badge";

export default function GenderBadge({ gender }: { gender: string }) {
  if (gender === "L") {
    return (
      <Badge variant="secondary" className="gap-1 bg-blue-50">
        <Mars className="w-3 h-3 text-blue-500" />
        Laki-laki
      </Badge>
    );
  }
  if (gender === "P") {
    return (
      <Badge variant="secondary" className="gap-1 bg-pink-50">
        <Venus className="w-3 h-3 text-pink-500" />
        Perempuan
      </Badge>
    );
  }
  return <span>-</span>;
}
