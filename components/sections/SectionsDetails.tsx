
"use client";

import {
  Course,
  MuxData,
  Progress,
  Purchase,
  Resource,
  Section,
} from "@prisma/client";
import toast from "react-hot-toast";
import { useState } from "react";
import axios from "axios";
import { File, Loader2, Lock } from "lucide-react";

import { Button } from "@/components/ui/button";
import ReadText from "@/components/custom/ReadText";
import MuxPlayer from "@mux/mux-player-react";
import Link from "next/link";
import ProgressButton from "./ProgressButton";
import SectionMenu from "../layout/SectionMenu";
import { useFlutterwave, closePaymentModal } from 'flutterwave-react-v3';
import { redirect, useRouter } from "next/navigation";


interface SectionsDetailsProps {
  course: Course & { sections: Section[] };
  section: Section;
  purchase: Purchase | null;
  muxData: MuxData | null;
  resources: Resource[] | [];
  progress: Progress | null;
}

const SectionsDetails = ({
  course,
  section,
  purchase,
  muxData,
  resources,
  progress,
}: SectionsDetailsProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const isLocked = !purchase && !section.isFree;

  type Config = {
      public_key: string;
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
  }
  const config: Config =  {
    public_key: 'FLWPUBK-a431cbb1ab60377246c9e41bb2a9002b-X',
    tx_ref: Date.now(),
    amount: Math.round(course.price!),
    currency: 'NGN',
    payment_options: 'card,mobilemoney,ussd',
    customer: {
      email: 'paxymekventures@gmail.com',
       phone_number: '09038984567',
      name: 'Prince Emy',
    },
    customizations: {
      title: 'Techxos Tutors',
      description: 'Payment for Courses in cart',
      logo: 'https://st2.depositphotos.com/4403291/7418/v/450/depositphotos_74189661-stock-illustration-online-shop-log.jpg',
    },
  };

  //@ts-ignore
  const handleFlutterPayment = useFlutterwave(config);

  const router = useRouter();

  const buyCourse = async () => {
    try {
      setIsLoading(true);
      handleFlutterPayment({
        callback: async (response) => {
          if(response.status === "successful") {
            console.log('Payment successful', response);
            try {
              const res = await axios.post(`/api/courses/${course.id}/checkout`);
              window.location.assign(res.data.url);
            } catch (err) {
              console.log("Failed to checkout course", err);
              toast.error("Payment failed!");
            }
            closePaymentModal() // this will close the modal programmatically           
            // Redirect or perform other actions here
          } else {
            console.log('Payment failed', response);
            // Handle failed payment
          }
        },
        onClose: () => {
          console.log('Payment modal closed');
          // Handle actions when the payment modal is closed
        },
      });     
    } catch (err) {
      console.log("Failed to chechout course", err);
      toast.error("Something went wrong!");
    } finally {
      setIsLoading(false);
      router.refresh();
    }
  };

  return (
    <div className="px-6 py-4 flex flex-col gap-5">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center">
        <h1 className="text-2xl font-bold max-md:mb-4">{section.title}</h1>

        <div className="flex gap-4">
          <SectionMenu course={course} />
          {!purchase ? (
            <Button onClick={buyCourse}>
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <p>Buy this course</p>
              )}
            </Button>
          ) : (
            <ProgressButton
              courseId={course.id}
              sectionId={section.id}
              isCompleted={!!progress?.isCompleted}
            /> // !! converts falsy values to boolean false
          )}
        </div>
      </div>

      <ReadText value={section.description!} />

      {isLocked ? (
        <div className="px-10 flex flex-col gap-5 items-center bg-[#FFF8EB]">
          <Lock className="h-8 w-8" />
          <p className="text-sm font-bold">
            Video for this section is locked!. Please buy the course to access
          </p>
        </div>
      ) : (
        <MuxPlayer
          playbackId={muxData?.playbackId || ""}
          className="md:max-w-[600px]"
        />
      )}

      <div>
        <h2 className="text-xl font-bold mb-5">Resources</h2>
        {resources.map((resource) => (
          <Link
            key={resource.id}
            href={resource.fileUrl}
            target="_blank"
            className="flex items-center bg-[#FFF8EB] rounded-lg text-sm font-medium p-3"
          >
            <File className="h-4 w-4 mr-4" />
            {resource.name}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SectionsDetails;





// FROM COPILOT 20-12-2024
// import { useFlutterwave, closePaymentModal } from 'flutterwave-react-v3';

// const SectionsDetails = ({ course, section, purchase, muxData, resources, progress }: SectionsDetailsProps) => {
//   const [isLoading, setIsLoading] = useState(false);
//   const isLocked = !purchase && !section.isFree;

//   const config = {
//     public_key: 'YOUR_FLUTTERWAVE_PUBLIC_KEY',
//     tx_ref: Date.now().toString(),
//     amount: Math.round(course.price!),
//     currency: 'NGN',
//     payment_options: 'card,mobilemoney,ussd',
//     customer: {
//       email: 'customer@example.com',
//       phone_number: '09012345678',
//       name: 'Customer Name',
//     },
//     customizations: {
//       title: 'Techxos Tutors',
//       description: 'Payment for Courses in cart',
//       logo: 'https://example.com/logo.png',
//     },
//   };

//   const handleFlutterPayment = useFlutterwave(config);

//   const buyCourse = async () => {
//     try {
//       setIsLoading(true);
//       handleFlutterPayment({
//         callback: (response) => {
//           if (response.status === 'successful') {
//             console.log('Payment successful', response);
//             // Perform actions after a successful payment
//             // For example, you can redirect the user or update the state
//             closePaymentModal(); // Close the payment modal
//             // Redirect or perform other actions here
//           } else {
//             console.log('Payment failed', response);
//             // Handle failed payment
//           }
//         },
//         onClose: () => {
//           console.log('Payment modal closed');
//           // Handle actions when the payment modal is closed
//         },
//       });
//     } catch (err) {
//       console.log('Failed to checkout course', err);
//       toast.error('Something went wrong!');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="px-6 py-4 flex flex-col gap-5">
//       <div className="flex flex-col md:flex-row md:justify-between md:items-center">
//         <h1 className="text-2xl font-bold max-md:mb-4">{section.title}</h1>
//         <div className="flex gap-4">
//           <SectionMenu course={course} />
//           {!purchase ? (
//             <Button onClick={buyCourse}>
//               {isLoading ? (
//                 <Loader2 className="h-4 w-4 animate-spin" />
//               ) : (
//                 <p>Buy this course</p>
//               )}
//             </Button>
//           ) : (
//             <ProgressButton
//               courseId={course.id}
//               sectionId={section.id}
//               isCompleted={!!progress?.isCompleted}
//             />
//           )}
//         </div>
//       </div>
//       <ReadText value={section.description!} />
//       {isLocked ? (
//         <div className="px-10 flex flex-col gap-5 items-center bg-[#FFF8EB]">
//           <Lock className="h-8 w-8" />
//           <p className="text-sm font-bold">
//             Video for this section is locked! Please buy the course to access.
//           </p>
//         </div>
//       ) : (
//         <MuxPlayer playbackId={muxData?.playbackId || ''} className="md:max-w-[600px]" />
//       )}
//       <div>
//         <h2 className="text-xl font-bold mb-5">Resources</h2>
//         {resources.map((resource) => (
//           <Link
//             key={resource.id}
//             href={resource.fileUrl}
//             target="_blank"
//             className="flex items-center bg-[#FFF8EB] rounded-lg text-sm font-medium p-3"
//           >
//             <File className="h-4 w-4 mr-4" />
//             {resource.name}
//           </Link>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default SectionsDetails;