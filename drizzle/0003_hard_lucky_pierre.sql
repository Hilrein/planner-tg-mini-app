CREATE TABLE `terms` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`content` text NOT NULL,
	`order` int NOT NULL DEFAULT 0,
	`active` int NOT NULL DEFAULT 1,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `terms_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `userAcceptances` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`termsId` int NOT NULL,
	`acceptedAt` timestamp NOT NULL DEFAULT (now()),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `userAcceptances_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `userAcceptances` ADD CONSTRAINT `userAcceptances_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `userAcceptances` ADD CONSTRAINT `userAcceptances_termsId_terms_id_fk` FOREIGN KEY (`termsId`) REFERENCES `terms`(`id`) ON DELETE cascade ON UPDATE no action;