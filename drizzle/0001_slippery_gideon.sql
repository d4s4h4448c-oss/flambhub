ALTER TABLE `bonus_hunts` ADD `owner_code` text;--> statement-breakpoint
CREATE INDEX `bonus_hunts_owner_idx` ON `bonus_hunts` (`owner_code`);