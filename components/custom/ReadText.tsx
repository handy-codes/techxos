"use client&quot;

import dynamic from &quot;next/dynamic&quot;;
import { useMemo } from &quot;react&quot;;
import &quot;react-quill/dist/quill.bubble.css&quot;;


const ReadText = ({ value }: { value: string }) => {
  const ReactQuill = useMemo(
    () => dynamic(() => import(&quot;react-quill&quot;), { ssr: false }),
    []
  );

  return (
    <ReactQuill
      theme=&quot;bubble"
      value={value}
      readOnly
    />
  );
};

export default ReadText;
