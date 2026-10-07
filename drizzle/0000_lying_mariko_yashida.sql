CREATE TABLE `bonus_hunts` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`currency` text DEFAULT 'EUR' NOT NULL,
	`starting_amount` real DEFAULT 0 NOT NULL,
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch() * 1000) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `hunt_slots` (
	`id` text PRIMARY KEY NOT NULL,
	`hunt_id` text NOT NULL,
	`slot_name` text NOT NULL,
	`provider` text DEFAULT '' NOT NULL,
	`stake` real NOT NULL,
	`player` text DEFAULT '' NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`win_amount` real DEFAULT 0 NOT NULL,
	`collected_at` integer,
	`position` integer DEFAULT 0 NOT NULL,
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	FOREIGN KEY (`hunt_id`) REFERENCES `bonus_hunts`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `hunt_slots_hunt_idx` ON `hunt_slots` (`hunt_id`);--> statement-breakpoint
CREATE INDEX `hunt_slots_status_idx` ON `hunt_slots` (`status`);--> statement-breakpoint
CREATE TABLE `wheel_entries` (
	`id` text PRIMARY KEY NOT NULL,
	`wheel_id` text NOT NULL,
	`label` text NOT NULL,
	`weight` integer DEFAULT 1 NOT NULL,
	`position` integer DEFAULT 0 NOT NULL,
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	FOREIGN KEY (`wheel_id`) REFERENCES `wheels`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `wheel_entries_wheel_idx` ON `wheel_entries` (`wheel_id`);--> statement-breakpoint
CREATE TABLE `wheel_spins` (
	`id` text PRIMARY KEY NOT NULL,
	`wheel_id` text NOT NULL,
	`entry_id` text NOT NULL,
	`result_label` text NOT NULL,
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	FOREIGN KEY (`wheel_id`) REFERENCES `wheels`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `wheel_spins_wheel_id_idx` ON `wheel_spins` (`wheel_id`,`id`);--> statement-breakpoint
CREATE INDEX `wheel_spins_created_idx` ON `wheel_spins` (`created_at`);--> statement-breakpoint
CREATE TABLE `wheels` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch() * 1000) NOT NULL
);
