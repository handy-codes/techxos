const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  try {
    const course = await prisma.course.findUnique({
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
    await prisma.$disconnect();
  }
}

main(); 