import { PrismaClient, LiveClassUserRole } from '@prisma/client';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });
dotenv.config();

const prismaClient = new PrismaClient();

async function seedLiveClasses() {
  try {
    // Check if Head Admin exists
    let headAdmin = await prismaClient.liveClassUser.findUnique({
      where: { email: "paxymekventures@gmail.com" }
    });

    // Create Head Admin if doesn't exist
    if (!headAdmin) {
      headAdmin = await prismaClient.liveClassUser.create({
        data: {
          email: "paxymekventures@gmail.com",
          role: LiveClassUserRole.HEAD_ADMIN,
          name: "Head Administrator",
          isActive: true,
          clerkUserId: "default_admin"
        },
      });
    }

    // Create category for Mathematics
    const category = await prismaClient.category.upsert({
      where: { name: 'Mathematics' },
      update: {},
      create: {
        name: 'Mathematics',
      },
    });

    // Create subcategory for JSS
    let subCategory = await prismaClient.subCategory.findFirst({
      where: { 
        name: 'Junior Secondary',
        categoryId: category.id,
      }
    });

    if (!subCategory) {
      subCategory = await prismaClient.subCategory.create({
        data: {
          name: 'Junior Secondary',
          categoryId: category.id,
        },
      });
    }

    // Create level for JSS
    const level = await prismaClient.level.upsert({
      where: { name: 'JSS' },
      update: {},
      create: {
        name: 'JSS',
      },
    });

    // Create mathematics-jss course
    const course = await prismaClient.course.upsert({
      where: { id: 'mathematics-jss' },
      update: {
        title: 'Mathematics (JSS Module)',
        description: 'Our comprehensive maths lessons cover all essential topics from the JSS curriculum, helping students build a strong foundation in mathematics.',
        price: 10000,
        isPublished: true,
        categoryId: category.id,
        subCategoryId: subCategory.id,
        levelId: level.id,
      },
      create: {
        id: 'mathematics-jss',
        instructorId: headAdmin.id,
        title: 'Mathematics (JSS Module)',
        description: 'Our comprehensive maths lessons cover all essential topics from the JSS curriculum, helping students build a strong foundation in mathematics.',
        price: 10000,
        isPublished: true,
        categoryId: category.id,
        subCategoryId: subCategory.id,
        levelId: level.id,
      },
    });

    // Create active zoom meeting for the course
    await prismaClient.courseZoomMeeting.upsert({
      where: { 
        id: 'afadc946-b82e-4852-a0af-e6d004cefc63'
      },
      update: {
        zoomLink: process.env.ZOOM_MATHS_JSS_MEETING_URL || "https://us05web.zoom.us/j/89661114279?pwd=gnL2oalIFeRPzNLIBHuYfsAGZ6CWRv.1",
        startTime: new Date(),
        duration: 60,
        isActive: true,
      },
      create: {
        id: 'afadc946-b82e-4852-a0af-e6d004cefc63',
        courseId: course.id,
        zoomLink: process.env.ZOOM_MATHS_JSS_MEETING_URL || "https://us05web.zoom.us/j/89661114279?pwd=gnL2oalIFeRPzNLIBHuYfsAGZ6CWRv.1",
        startTime: new Date(),
        duration: 60,
        isActive: true,
      },
    });

    // Check if live class exists
    let liveClass = await prismaClient.liveClass.findFirst({
      where: { title: "Mathematics JSS" }
    });

    // Create live class if doesn't exist
    if (!liveClass) {
      liveClass = await prismaClient.liveClass.create({
        data: {
          title: "Mathematics JSS",
          description: "Our comprehensive maths lessons cover all essential topics from the JSS curriculum, helping students build a strong foundation in mathematics.",
          zoomLink: process.env.ZOOM_MATHS_JSS_MEETING_URL || "https://us05web.zoom.us/j/89661114279?pwd=gnL2oalIFeRPzNLIBHuYfsAGZ6CWRv.1",
          zoomMeetingId: process.env.ZOOM_MATHS_JSS_MEETING_ID?.replace(/\s/g, '') || "89661114279",
          zoomPassword: "gnL2oalIFeRPzNLIBHuYfsAGZ6CWRv.1",
          startTime: new Date(),
          endTime: new Date(Date.now() + 12 * 7 * 24 * 60 * 60 * 1000), // 12 weeks from now
          isActive: true,
          price: 10000,
          maxStudents: 50,
          duration: 12,
          batchNumber: 1,
          lecturerId: headAdmin.id,
        },
      });
    }

    // Create class materials if they don't exist
    const materials = await prismaClient.liveClassMaterial.findMany({
      where: { liveClassId: liveClass.id }
    });

    if (materials.length === 0) {
      await prismaClient.liveClassMaterial.createMany({
        data: [
          {
            title: "Course Syllabus",
            fileUrl: "https://example.com/syllabus.pdf",
            type: "DOCUMENT",
            liveClassId: liveClass.id,
          },
          {
            title: "Week 1 Introduction",
            fileUrl: "https://example.com/week1.pdf",
            type: "DOCUMENT",
            liveClassId: liveClass.id,
          },
          {
            title: "Mathematics Basics Video",
            fileUrl: "https://example.com/basics.mp4",
            type: "VIDEO",
            liveClassId: liveClass.id,
          },
        ],
      });
    }

    // Create class schedules if they don't exist
    const schedules = await prismaClient.liveClassSchedule.findMany({
      where: { liveClassId: liveClass.id }
    });

    if (schedules.length === 0) {
      await prismaClient.liveClassSchedule.createMany({
        data: [
          {
            liveClassId: liveClass.id,
            startTime: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
            endTime: new Date(Date.now() + 25 * 60 * 60 * 1000), // Tomorrow + 1 hour
            isRecurring: true,
            recurrence: "FREQ=WEEKLY;BYDAY=MO,WE,FR",
          },
          {
            liveClassId: liveClass.id,
            startTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // Day after tomorrow
            endTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // Day after tomorrow + 1 hour
            isRecurring: true,
            recurrence: "FREQ=WEEKLY;BYDAY=TU,TH",
          },
        ],
      });
    }

    console.log("Mathematics JSS course and zoom meeting seeded successfully");
  } catch (error) {
    console.error("Error seeding mathematics JSS course:", error);
  } finally {
    await prismaClient.$disconnect();
  }
}

seedLiveClasses(); 