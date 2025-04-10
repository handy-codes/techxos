"use client&quot;

import &quot;react-quill/dist/quill.snow.css&quot;;
import dynamic from &quot;next/dynamic&quot;;
import { useMemo } from &quot;react&quot;;

interface RichEditorProps {
  placeholder: string;
  onChange: (value: string) => void;
  value?: string;
}

const RichEditor = ({ placeholder, onChange, value }: RichEditorProps) => {
  const ReactQuill = useMemo(
    () => dynamic(() => import(&quot;react-quill&quot;), { ssr: false }),
    []
  );

  return (
    <ReactQuill
      theme=&quot;snow"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    />
  );
};

export default RichEditor;
