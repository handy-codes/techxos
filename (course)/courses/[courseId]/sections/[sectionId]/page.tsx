const purchase = await db.purchase.findUnique({
  where: {
    userId_courseId: {
      userId: userId,
      courseId: params.courseId
    }
  }
}); 