const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  try {
    // Check if Head Admin exists
    let headAdmin = await prisma.liveClassUser.findUnique({
      where: { email: "paxymekventures@gmail.com" }
    });

    // Create Head Admin if doesn't exist
    if (!headAdmin) {
      headAdmin = await prisma.liveClassUser.create({
        data: {
          email: "paxymekventures@gmail.com",
          role: "HEAD_ADMIN",
          name: "Head Administrator",
          isActive: true,
        },
      });
    }

    // Check if live class exists
    let liveClass = await prisma.liveClass.findFirst({
      where: { title: "Project Management" }
    });

    // Create live class if doesn't exist
    if (!liveClass) {
      liveClass = await prisma.liveClass.create({
        data: {
          title: "Project Management",
          description: "Comprehensive project management course covering all aspects of modern project management.",
          zoomLink: process.env.ZOOM_PROJECT_MGT_MEETING_URL || "https://us05web.zoom.us/j/89661114279?pwd=gnL2oalIFeRPzNLIBHuYfsAGZ6CWRv.1",
          zoomMeetingId: process.env.ZOOM_PROJECT_MGT_MEETING_ID?.replace(/\s/g, '') || "89661114279",
          zoomPassword: "gnL2oalIFeRPzNLIBHuYfsAGZ6CWRv.1",
          startTime: new Date(),
          endTime: new Date(Date.now() + 12 * 7 * 24 * 60 * 60 * 1000), // 12 weeks from now
          isActive: true,
          price: 250000,
          maxStudents: 50,
          duration: 12,
          batchNumber: 1,
          lecturerId: headAdmin.id,
        },
      });
    }

    // Create class materials if they don't exist
    const materials = await prisma.liveClassMaterial.findMany({
      where: { liveClassId: liveClass.id }
    });

    if (materials.length === 0) {
      await prisma.liveClassMaterial.createMany({
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
            title: "Project Management Basics Video",
            fileUrl: "https://example.com/basics.mp4",
            type: "VIDEO",
            liveClassId: liveClass.id,
          },
        ],
      });
    }

    // Create class schedules if they don't exist
    const schedules = await prisma.liveClassSchedule.findMany({
      where: { liveClassId: liveClass.id }
    });

    if (schedules.length === 0) {
      await prisma.liveClassSchedule.createMany({
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

    console.log("Live class data seeded successfully");
  } catch (error) {
    console.error("Error seeding live class data:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main(); 