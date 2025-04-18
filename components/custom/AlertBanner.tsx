import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Rocket, TriangleAlert } from "lucide-react";

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
      className={`my-4 ${isCompleted ? "bg-green-500 text-white" : ""}`}
      variant={isCompleted ? "default" : "destructive"}
    >
      {isCompleted ? (
        <Rocket className="h-4 w-4" />
      ) : (
        <TriangleAlert className="h-4 w-4" />
      )}
      <AlertTitle className="text-xs font-medium">
        {missingFieldsCount} missing field(s) / {requiredFieldsCount} required
        fields
      </AlertTitle>
      <AlertDescription className="text-xs">
        {isCompleted
          ? "Great job! Ready to publish"
          : "You can only publish when all the required fields are completed"}
      </AlertDescription>
    </Alert>
  );
};

export default AlertBanner;
