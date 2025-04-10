"use client&quot;;

import { ourFileRouter } from &quot;@/app/api/uploadthing/core&quot;;
import { UploadDropzone } from &quot;@/lib/uploadthing&quot;;
import Image from &quot;next/image&quot;;
import toast from &quot;react-hot-toast&quot;;

interface FileUploadProps {
  value: string;
  onChange: (url?: string) => void;
  endpoint: keyof typeof ourFileRouter;
  page: string;
}

const FileUpload = ({ value, onChange, endpoint, page }: FileUploadProps) => {
  return (
    <div className=&quot;flex flex-col gap-2&quot;>
      {page === &quot;Edit Course&quot; && value !== &quot;" && (
        <Image
          src={value}
          alt=&quot;image&quot;
          width={500}
          height={500}
          className=&quot;w-[280px] h-[200px] object-cover rounded-xl&quot;
        />
      )}

      {page === &quot;Edit Section&quot; && value !== &quot;&quot; && (
        <p className="text-sm font-medium&quot;>{value}</p>
      )}

      <UploadDropzone
        endpoint={endpoint}
        onClientUploadComplete={(res) => {
          onChange(res?.[0].url);
        }}
        onUploadError={(error: Error) => {
          toast.error(error.message);
        }}
        className=&quot;w-[280px] h-[200px]"
      />
    </div>
  );
};

export default FileUpload;
