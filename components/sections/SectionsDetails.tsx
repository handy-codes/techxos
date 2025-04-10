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
import { useState, useEffect } from "react";
import axios from "axios";
import { File, Loader2, Lock } from "lucide-react";

import { Button } from "@/components/ui/button";
import ReadText from "@/components/custom/ReadText";
import MuxPlayer from "@mux/mux-player-react";
import Link from "next/link";
import ProgressButton from "./ProgressButton";
import SectionMenu from "../layout/SectionMenu";
import { useFlutterwave, closePaymentModal } from "flutterwave-react-v3";
import { redirect, useRouter } from "next/navigation";

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
      currency: "NGN",
      payment_options: "card,mobilemoney,ussd",
      customer: {
        email: "paxymekventures@gmail.com",
        phone_number: "09038984567",
        name: "Prince Emy",
      },
      customizations: {
        title: "Techxos Tutors",
        description: "Payment for Courses in cart",
        logo: "https://st2.depositphotos.com/4403291/7418/v/450/depositphotos_74189661-stock-illustration-online-shop-log.jpg",
      },
    };
    setPaymentConfig(config);
  }, [course.price]);

  const buyCourse = async () => {
    try {
      setIsLoading(true);
      makePayment({
        callback: async (response) => {
          if (response.status === "successful") {
            console.log("Payment successful", response);
            try {
              const res = await axios.post(
                `/api/courses/${course.id}/checkout`
              );
              window.location.assign(res.data.url);
            } catch (err) {
              console.log("Failed to checkout course", err);
              toast.error("Payment failed!");
            }
          } else {
            toast.error("Payment failed!");
          }
        },
        onClose: () => {
          setIsLoading(false);
        },
      });
    } catch (error) {
      console.error("Payment error:", error);
      toast.error("Payment failed!");
      setIsLoading(false);
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
            /> 
          )}
        </div>
      </div>

      <ReadText value={section.description!} />

      {isLocked ? (
        <div className="px-10 flex flex-col gap-5 items-center bg-[#FFF8EB]">
          <Lock className="h-8 w-8" />
          <p className="text-sm font-bold">
            This chapter is locked. You can buy the course to access all the
            chapters.
          </p>
        </div>
      ) : (
        <MuxPlayer
          playbackId={muxData?.playbackId || ""}
          className="w-full h-auto max-w-full md:max-w-[600px] aspect-video"        />
      )}

      {resources.length > 0 && (
        <div>
          <h2 className="text-xl font-bold mb-5">Resources</h2>
          {resources.map((resource: Resource) => (
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
      )}
    </div>
  );
};

export default SectionsDetails;

