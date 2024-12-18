
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
    public_key: 'FLWPUBK_TEST-7e6875e5be98e38f9ad5d3fc801b3838-X',
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
        callback: (response) => {
          if(response.status === "successful") {
            console.log("payment successful"); 
            // closePaymentModal();
            // return redirect(`/`);
            // return redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/courses/${course.id}/overview?canceled=true`);
          }
          console.log(response);          
          closePaymentModal() // this will close the modal programmatically           
        },
        onClose: () => {
        },
      });     
      const res = await axios.post(`/api/courses/${course.id}/checkout`);
      window.location.assign(res.data.url);

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






// "use client";

// import {
//   Course,
//   MuxData,
//   Progress,
//   Purchase,
//   Resource,
//   Section,
// } from "@prisma/client";
// import toast from "react-hot-toast";
// import { useState } from "react";
// import axios from "axios";
// import { File, Loader2, Lock } from "lucide-react";

// import { Button } from "@/components/ui/button";
// import ReadText from "@/components/custom/ReadText";
// import MuxPlayer from "@mux/mux-player-react";
// import Link from "next/link";
// import ProgressButton from "./ProgressButton";
// import SectionMenu from "../layout/SectionMenu";
// // import { useFlutterwave, closePaymentModal } from 'flutterwave-react-v3';
// import { usePaystackPayment } from 'react-paystack';
// import { redirect } from "next/navigation";


// interface SectionsDetailsProps {
//   course: Course & { sections: Section[] };
//   section: Section;
//   purchase: Purchase | null;
//   muxData: MuxData | null;
//   resources: Resource[] | [];
//   progress: Progress | null;
// }

// const SectionsDetails = ({
//   course,
//   section,
//   purchase,
//   muxData,
//   resources,
//   progress,
// }: SectionsDetailsProps) => {
//   const [isLoading, setIsLoading] = useState(false);
//   const isLocked = !purchase && !section.isFree;

//   const config = {
//     reference: (new Date()).getTime().toString(),
//     email: "user@example.com",
//     amount: Math.round(course.price! * 100),
//     publicKey: 'pk_test_17a0c2285a889761fc4de298fad5e405e6916d04',
// };


// const onSuccess = (reference: any) => {
//   // Implementation for whatever you want to do with reference and after success call.
//   console.log(reference);
// };

// const onClose = () => {};

//   const initializePayment = usePaystackPayment(config);

//   const buyCourse = async () => {
//     try {
//       setIsLoading(true);
      
//       const response = await axios.post(`/api/courses/${course.id}/checkout`);
//       //@ts-ignore
//       initializePayment(onSuccess, onClose); 
//       window.location.assign(response.data.url);
//       window.location.reload();
//       return redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/courses/${course.id}/overview?success=true`);
    
//     } catch (err) {
//       console.log("Failed to chechout course", err);
//       toast.error("Something went wrong!");
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
//             /> // !! converts falsy values to boolean false
//           )}
//         </div>
//       </div>

//       <ReadText value={section.description!} />

//       {isLocked ? (
//         <div className="px-10 flex flex-col gap-5 items-center bg-[#FFF8EB]">
//           <Lock className="h-8 w-8" />
//           <p className="text-sm font-bold">
//             Video for this section is locked!. Please buy the course to access
//           </p>
//         </div>
//       ) : (
//         <MuxPlayer
//           playbackId={muxData?.playbackId || ""}
//           className="md:max-w-[600px]"
//         />
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


