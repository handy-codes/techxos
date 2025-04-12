import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function main() {
  try {
    // Get all live classes
    const liveClasses = await prisma.liveClass.findMany({
      where: {
        zoomMeetingId: null
      }
    });

    // Update each live class with the project management meeting ID
    for (const liveClass of liveClasses) {
      if (liveClass.title === "Project Management") {
        await prisma.liveClass.update({
          where: { id: liveClass.id },
          data: {
            zoomMeetingId: process.env.ZOOM_PROJECT_MGT_MEETING_ID?.replace(/\s/g, '') || "89661114279",
            zoomPassword: process.env.ZOOM_PROJECT_MGT_MEETING_PASSWORD || "gnL2oalIFeRPzNLIBHuYfsAGZ6CWRv.1"
          }
        });
        console.log(`Updated Zoom meeting ID for class: ${liveClass.title}`);
      }
    }

    console.log('Successfully updated Zoom meeting IDs');
  } catch (error) {
    console.error('Error updating Zoom meeting IDs:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error('Script failed:', error);
  process.exit(1);
}); 