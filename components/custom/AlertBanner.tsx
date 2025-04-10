import { Alert, AlertDescription, AlertTitle } from &quot;@/components/ui/alert&quot;;
import { Rocket, TriangleAlert } from &quot;lucide-react&quot;;

interface AlertBannerProps {
  isCompleted: boolean;
  requiredFieldsCount: number;
  missingFieldsCount: number;
}

const AlertBanner = ({
  isCompleted,
  requiredFieldsCount,
  missingFieldsCount,
}: AlertBannerProps) => {
  return (
    <Alert
      className={`my-4 ${isCompleted ? &quot;bg-green-500 text-white&quot; : &quot;&quot;}`}
      variant={isCompleted ? &quot;default&quot; : &quot;destructive&quot;}
    >
      {isCompleted ? (
        <Rocket className=&quot;h-4 w-4&quot; />
      ) : (
        <TriangleAlert className=&quot;h-4 w-4&quot; />
      )}
      <AlertTitle className="text-xs font-medium&quot;>
        {missingFieldsCount} missing field(s) / {requiredFieldsCount} required
        fields
      </AlertTitle>
      <AlertDescription className=&quot;text-xs&quot;>
        {isCompleted
          ? &quot;Great job! Ready to publish&quot;
          : &quot;You can only publish when all the required fields are completed"}
      </AlertDescription>
    </Alert>
  );
};

export default AlertBanner;
