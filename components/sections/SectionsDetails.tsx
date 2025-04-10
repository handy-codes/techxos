"use client&quot;;

import {
  Course,
  MuxData,
  Progress,
  Purchase,
  Resource,
  Section,
} from &quot;@prisma/client&quot;;
import toast from &quot;react-hot-toast&quot;;
import { useState, useEffect } from &quot;react&quot;;
import axios from &quot;axios&quot;;
import { File, Loader2, Lock } from &quot;lucide-react&quot;;

import { Button } from &quot;@/components/ui/button&quot;;
import ReadText from &quot;@/components/custom/ReadText&quot;;
import MuxPlayer from &quot;@mux/mux-player-react&quot;;
import Link from &quot;next/link&quot;;
import ProgressButton from &quot;./ProgressButton&quot;;
import SectionMenu from &quot;../layout/SectionMenu&quot;;
import { useFlutterwave, closePaymentModal } from &quot;flutterwave-react-v3&quot;;
import { redirect, useRouter } from &quot;next/navigation&quot;;

interface SectionsDetailsProps {
  course: Course & { sections: Section[] };
  section: Section;
  purchase: Purchase | null;
  muxData: MuxData | null;
  resources: Resource[] | [];
  progress: Progress | null;
}

type FlutterwaveConfig = {
  public_key: string | undefined;
  tx_ref?: number;
  amount: number;
  currency: string;
  payment_options: string;
  customer: {
    email: string;
    phone_number: string;
    name: string;
  };
  customizations: {
    title: string;
    description: string;
    logo: string;
  };
};

const SectionsDetails = ({
  course,
  section,
  purchase,
  muxData,
  resources,
  progress,
}: SectionsDetailsProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [paymentConfig, setPaymentConfig] = useState<FlutterwaveConfig | null>(null);
  const isLocked = !purchase && !section.isFree;
  const router = useRouter();

  const makePayment = useFlutterwave(paymentConfig || {});

  useEffect(() => {
    const config: FlutterwaveConfig = {
      public_key: process.env.NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY,
      tx_ref: Date.now(),
      amount: Math.round(course.price!),
      currency: &quot;NGN&quot;,
      payment_options: &quot;card,mobilemoney,ussd&quot;,
      customer: {
        email: &quot;paxymekventures@gmail.com&quot;,
        phone_number: &quot;09038984567&quot;,
        name: &quot;Prince Emy&quot;,
      },
      customizations: {
        title: &quot;Techxos Tutors&quot;,
        description: &quot;Payment for Courses in cart&quot;,
        logo: &quot;https://st2.depositphotos.com/4403291/7418/v/450/depositphotos_74189661-stock-illustration-online-shop-log.jpg&quot;,
      },
    };
    setPaymentConfig(config);
  }, [course.price]);

  const buyCourse = async () => {
    try {
      setIsLoading(true);
      makePayment({
        callback: async (response) => {
          if (response.status === &quot;successful&quot;) {
            console.log(&quot;Payment successful&quot;, response);
            try {
              const res = await axios.post(
                `/api/courses/${course.id}/checkout`
              );
              window.location.assign(res.data.url);
            } catch (err) {
              console.log(&quot;Failed to checkout course&quot;, err);
              toast.error(&quot;Payment failed!&quot;);
            }
          } else {
            toast.error(&quot;Payment failed!&quot;);
          }
        },
        onClose: () => {
          setIsLoading(false);
        },
      });
    } catch (error) {
      console.error(&quot;Payment error:&quot;, error);
      toast.error(&quot;Payment failed!&quot;);
      setIsLoading(false);
    }
  };

  return (
    <div className=&quot;px-6 py-4 flex flex-col gap-5&quot;>
      <div className=&quot;flex flex-col md:flex-row md:justify-between md:items-center&quot;>
        <h1 className=&quot;text-2xl font-bold max-md:mb-4&quot;>{section.title}</h1>

        <div className=&quot;flex gap-4&quot;>
          <SectionMenu course={course} />
          {!purchase ? (
            <Button onClick={buyCourse}>
              {isLoading ? (
                <Loader2 className=&quot;h-4 w-4 animate-spin&quot; />
              ) : (
                <p>Buy this course</p>
              )}
            </Button>
          ) : (
            <ProgressButton
              courseId={course.id}
              sectionId={section.id}
              isCompleted={!!progress?.isCompleted}
            /> 
          )}
        </div>
      </div>

      <ReadText value={section.description!} />

      {isLocked ? (
        <div className=&quot;px-10 flex flex-col gap-5 items-center bg-[#FFF8EB]&quot;>
          <Lock className=&quot;h-8 w-8&quot; />
          <p className=&quot;text-sm font-bold&quot;>
            This chapter is locked. You can buy the course to access all the
            chapters.
          </p>
        </div>
      ) : (
        <MuxPlayer
          playbackId={muxData?.playbackId || &quot;"}
          className=&quot;w-full h-auto max-w-full md:max-w-[600px] aspect-video&quot;        />
      )}

      {resources.length > 0 && (
        <div>
          <h2 className="text-xl font-bold mb-5&quot;>Resources</h2>
          {resources.map((resource: Resource) => (
            <Link
              key={resource.id}
              href={resource.fileUrl}
              target=&quot;_blank&quot;
              className=&quot;flex items-center bg-[#FFF8EB] rounded-lg text-sm font-medium p-3&quot;
            >
              <File className=&quot;h-4 w-4 mr-4" />
              {resource.name}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default SectionsDetails;

