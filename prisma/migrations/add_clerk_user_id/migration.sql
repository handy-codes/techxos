-- Add clerkUserId column to LiveClassUser table
ALTER TABLE `LiveClassUser` ADD COLUMN `clerkUserId` VARCHAR(191) NULL;

-- Make clerkUserId unique
ALTER TABLE `LiveClassUser` ADD UNIQUE INDEX `LiveClassUser_clerkUserId_key` (`clerkUserId`);

-- Create index on clerkUserId
CREATE INDEX `LiveClassUser_clerkUserId_idx` ON `LiveClassUser`(`clerkUserId`); 