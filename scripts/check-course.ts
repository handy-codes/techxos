import { PrismaClient } from '@prisma/client';

const prismaClient = new PrismaClient();

async function checkCourse() {
  try {
    const course = await prismaClient.course.findUnique({
      where: {
        id: 'mathematics-jss'
      },
      include: {
        zoomMeetings: true,
        sections: true,
        purchases: true
      }
    });

    console.log('Course data:', JSON.stringify(course, null, 2));
  } catch (error) {
    console.error('Error fetching course:', error);
  } finally {
    await prismaClient.$disconnect();
  }
}

checkCourse(); 