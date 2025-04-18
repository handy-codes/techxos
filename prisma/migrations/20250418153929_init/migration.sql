-- CreateTable
CREATE TABLE `Course` (
    `id` VARCHAR(191) NOT NULL,
    `instructorId` VARCHAR(191) NOT NULL,
    `title` TEXT NOT NULL,
    `subtitle` TEXT NULL,
    `description` TEXT NULL,
    `imageUrl` TEXT NULL,
    `price` DOUBLE NULL,
    `isPublished` BOOLEAN NOT NULL DEFAULT false,
    `categoryId` VARCHAR(191) NOT NULL,
    `subCategoryId` VARCHAR(191) NOT NULL,
    `levelId` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `Course_categoryId_idx`(`categoryId`),
    INDEX `Course_subCategoryId_idx`(`subCategoryId`),
    INDEX `Course_levelId_idx`(`levelId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Category` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Category_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SubCategory` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `categoryId` VARCHAR(191) NOT NULL,

    INDEX `SubCategory_categoryId_idx`(`categoryId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Level` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Level_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Section` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `description` TEXT NULL,
    `videoUrl` TEXT NULL,
    `position` INTEGER NOT NULL,
    `isPublished` BOOLEAN NOT NULL DEFAULT false,
    `isFree` BOOLEAN NOT NULL DEFAULT false,
    `courseId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `Section_courseId_idx`(`courseId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MuxData` (
    `id` VARCHAR(191) NOT NULL,
    `assetId` VARCHAR(191) NOT NULL,
    `playbackId` VARCHAR(191) NULL,
    `sectionId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `MuxData_sectionId_key`(`sectionId`),
    INDEX `MuxData_sectionId_idx`(`sectionId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Resource` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `fileUrl` VARCHAR(191) NOT NULL,
    `sectionId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `Resource_sectionId_idx`(`sectionId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Progress` (
    `id` VARCHAR(191) NOT NULL,
    `studentId` VARCHAR(191) NOT NULL,
    `sectionId` VARCHAR(191) NOT NULL,
    `isCompleted` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `Progress_sectionId_idx`(`sectionId`),
    UNIQUE INDEX `Progress_studentId_sectionId_key`(`studentId`, `sectionId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Purchase` (
    `id` VARCHAR(191) NOT NULL,
    `customerId` VARCHAR(191) NOT NULL,
    `courseId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `Purchase_courseId_idx`(`courseId`),
    UNIQUE INDEX `Purchase_customerId_courseId_key`(`customerId`, `courseId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `StripeCustomer` (
    `id` VARCHAR(191) NOT NULL,
    `customerId` VARCHAR(191) NOT NULL,
    `stripeCustomerId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `StripeCustomer_customerId_key`(`customerId`),
    UNIQUE INDEX `StripeCustomer_stripeCustomerId_key`(`stripeCustomerId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LiveClassUser` (
    `id` VARCHAR(191) NOT NULL,
    `clerkUserId` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `role` ENUM('HEAD_ADMIN', 'ADMIN', 'LECTURER', 'LEARNER', 'VISITOR') NOT NULL DEFAULT 'LEARNER',
    `name` VARCHAR(191) NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `LiveClassUser_clerkUserId_key`(`clerkUserId`),
    UNIQUE INDEX `LiveClassUser_email_key`(`email`),
    INDEX `LiveClassUser_role_idx`(`role`),
    INDEX `LiveClassUser_isActive_idx`(`isActive`),
    INDEX `LiveClassUser_clerkUserId_idx`(`clerkUserId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LiveClass` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `zoomLink` VARCHAR(191) NULL,
    `zoomMeetingId` VARCHAR(191) NULL,
    `zoomPassword` VARCHAR(191) NULL,
    `startTime` DATETIME(3) NOT NULL,
    `endTime` DATETIME(3) NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT false,
    `price` DOUBLE NOT NULL,
    `maxStudents` INTEGER NULL,
    `duration` INTEGER NOT NULL,
    `batchNumber` INTEGER NOT NULL,
    `lecturerId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `LiveClass_lecturerId_idx`(`lecturerId`),
    INDEX `LiveClass_isActive_idx`(`isActive`),
    INDEX `LiveClass_startTime_idx`(`startTime`),
    INDEX `LiveClass_endTime_idx`(`endTime`),
    INDEX `LiveClass_price_idx`(`price`),
    INDEX `LiveClass_batchNumber_idx`(`batchNumber`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LiveClassPurchase` (
    `id` VARCHAR(191) NOT NULL,
    `studentId` VARCHAR(191) NOT NULL,
    `liveClassId` VARCHAR(191) NOT NULL,
    `status` ENUM('PENDING', 'COMPLETED', 'FAILED', 'REFUNDED') NOT NULL DEFAULT 'PENDING',
    `amount` DOUBLE NOT NULL,
    `transactionId` VARCHAR(191) NULL,
    `flwRef` VARCHAR(191) NULL,
    `txRef` VARCHAR(191) NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `startDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `endDate` DATETIME(3) NOT NULL,
    `courseName` VARCHAR(191) NULL,
    `studentEmail` VARCHAR(191) NULL,
    `studentName` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `LiveClassPurchase_liveClassId_idx`(`liveClassId`),
    INDEX `LiveClassPurchase_studentId_idx`(`studentId`),
    INDEX `LiveClassPurchase_status_idx`(`status`),
    INDEX `LiveClassPurchase_isActive_idx`(`isActive`),
    INDEX `LiveClassPurchase_startDate_idx`(`startDate`),
    INDEX `LiveClassPurchase_endDate_idx`(`endDate`),
    UNIQUE INDEX `LiveClassPurchase_studentId_liveClassId_key`(`studentId`, `liveClassId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SystemSettings` (
    `id` VARCHAR(191) NOT NULL,
    `siteName` VARCHAR(191) NOT NULL DEFAULT 'TechXOS Academy',
    `siteUrl` VARCHAR(191) NOT NULL DEFAULT 'https://techxos.com',
    `maintenanceMode` BOOLEAN NOT NULL DEFAULT false,
    `emailNotifications` BOOLEAN NOT NULL DEFAULT true,
    `studentEnrollmentNotifications` BOOLEAN NOT NULL DEFAULT true,
    `paymentNotifications` BOOLEAN NOT NULL DEFAULT true,
    `twoFactorAuth` BOOLEAN NOT NULL DEFAULT false,
    `sessionTimeout` BOOLEAN NOT NULL DEFAULT true,
    `sessionTimeoutMinutes` INTEGER NOT NULL DEFAULT 60,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LiveClassMaterial` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `fileUrl` VARCHAR(191) NOT NULL,
    `type` ENUM('DOCUMENT', 'VIDEO', 'ASSIGNMENT', 'QUIZ') NOT NULL,
    `liveClassId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `LiveClassMaterial_liveClassId_idx`(`liveClassId`),
    INDEX `LiveClassMaterial_type_idx`(`type`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LiveClassSchedule` (
    `id` VARCHAR(191) NOT NULL,
    `liveClassId` VARCHAR(191) NOT NULL,
    `startTime` DATETIME(3) NOT NULL,
    `endTime` DATETIME(3) NOT NULL,
    `isRecurring` BOOLEAN NOT NULL DEFAULT false,
    `recurrence` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `LiveClassSchedule_liveClassId_idx`(`liveClassId`),
    INDEX `LiveClassSchedule_startTime_idx`(`startTime`),
    INDEX `LiveClassSchedule_endTime_idx`(`endTime`),
    INDEX `LiveClassSchedule_isRecurring_idx`(`isRecurring`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LiveClassAttendance` (
    `id` VARCHAR(191) NOT NULL,
    `liveClassId` VARCHAR(191) NOT NULL,
    `studentId` VARCHAR(191) NOT NULL,
    `joinTime` DATETIME(3) NOT NULL,
    `leaveTime` DATETIME(3) NULL,
    `duration` INTEGER NULL,
    `status` ENUM('PRESENT', 'ABSENT', 'LATE', 'LEFT_EARLY') NOT NULL DEFAULT 'PRESENT',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `LiveClassAttendance_liveClassId_idx`(`liveClassId`),
    INDEX `LiveClassAttendance_studentId_idx`(`studentId`),
    INDEX `LiveClassAttendance_joinTime_idx`(`joinTime`),
    INDEX `LiveClassAttendance_status_idx`(`status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ZoomMeeting` (
    `id` VARCHAR(191) NOT NULL,
    `zoomMeetingId` VARCHAR(191) NULL,
    `topic` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NULL,
    `startTime` DATETIME(3) NOT NULL,
    `duration` INTEGER NOT NULL,
    `agenda` VARCHAR(191) NULL,
    `status` ENUM('SCHEDULED', 'STARTED', 'ENDED', 'CANCELLED') NOT NULL DEFAULT 'SCHEDULED',
    `joinUrl` VARCHAR(191) NULL,
    `startUrl` VARCHAR(191) NULL,
    `hostEmail` VARCHAR(191) NULL,
    `liveClassId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `ZoomMeeting_zoomMeetingId_key`(`zoomMeetingId`),
    INDEX `ZoomMeeting_liveClassId_idx`(`liveClassId`),
    INDEX `ZoomMeeting_status_idx`(`status`),
    INDEX `ZoomMeeting_startTime_idx`(`startTime`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ZoomRecording` (
    `id` VARCHAR(191) NOT NULL,
    `zoomRecordingId` VARCHAR(191) NULL,
    `meetingId` VARCHAR(191) NOT NULL,
    `recordingType` VARCHAR(191) NOT NULL,
    `recordingStart` DATETIME(3) NOT NULL,
    `recordingEnd` DATETIME(3) NULL,
    `fileType` VARCHAR(191) NOT NULL,
    `fileSize` INTEGER NULL,
    `playUrl` VARCHAR(191) NULL,
    `downloadUrl` VARCHAR(191) NULL,
    `status` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `ZoomRecording_zoomRecordingId_key`(`zoomRecordingId`),
    INDEX `ZoomRecording_meetingId_idx`(`meetingId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ZoomAttendance` (
    `id` VARCHAR(191) NOT NULL,
    `meetingId` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `userName` VARCHAR(191) NOT NULL,
    `userEmail` VARCHAR(191) NOT NULL,
    `userRole` ENUM('HEAD_ADMIN', 'ADMIN', 'LECTURER', 'LEARNER', 'VISITOR') NOT NULL,
    `joinTime` DATETIME(3) NOT NULL,
    `leaveTime` DATETIME(3) NULL,
    `duration` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `ZoomAttendance_meetingId_idx`(`meetingId`),
    INDEX `ZoomAttendance_userId_idx`(`userId`),
    INDEX `ZoomAttendance_joinTime_idx`(`joinTime`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CourseZoomMeeting` (
    `id` VARCHAR(191) NOT NULL,
    `courseId` VARCHAR(191) NOT NULL,
    `zoomLink` TEXT NOT NULL,
    `startTime` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `duration` INTEGER NOT NULL DEFAULT 60,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `CourseZoomMeeting_courseId_idx`(`courseId`),
    INDEX `CourseZoomMeeting_isActive_idx`(`isActive`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `User` (
    `id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NULL,
    `role` VARCHAR(191) NOT NULL DEFAULT 'user',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MathsDemo` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `class` VARCHAR(191) NOT NULL,
    `topic` VARCHAR(191) NULL,
    `trainingDate` DATETIME(3) NOT NULL,
    `whatsappGroup` BOOLEAN NOT NULL DEFAULT false,
    `startTime` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `duration` INTEGER NOT NULL DEFAULT 60,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `MathsDemo_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ClassMode` (
    `id` VARCHAR(191) NOT NULL,
    `mode` VARCHAR(191) NOT NULL DEFAULT 'paid',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
