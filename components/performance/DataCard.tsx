import { Card, CardContent, CardHeader, CardTitle } from &quot;@/components/ui/card&quot;;
import { formatPrice } from &quot;@/lib/formatPrice&quot;;

interface DataCardProps {
  value: number;
  label: string;
  shouldFormat?: boolean;
}

const DataCard = ({ value, label, shouldFormat }: DataCardProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2&quot;>
        <CardTitle className=&quot;text-sm font-medium&quot;>{label}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className=&quot;text-lg font-bold">
          {shouldFormat ? formatPrice(value) : value}
        </div>
      </CardContent>
    </Card>
  );
};

export default DataCard;
