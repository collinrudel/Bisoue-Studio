CREATE TABLE `shipping_rates` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`stripe_rate_id` text NOT NULL,
	`is_active` integer DEFAULT true NOT NULL
);
