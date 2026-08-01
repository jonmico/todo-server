create table if not exists users (
	id	char(36) primary key default(uuid()),
	email	varchar(255) not null unique,
	first_name	varchar(32) not null,
	hashed_password	varchar(255) not null,
	created_at	timestamp not null default current_timestamp,
	updated_at timestamp not null default current_timestamp on update current_timestamp
);

create table if not exists todos (
	id char(36)	primary key default(uuid()),
	user_id	char(36) not null,
	title	varchar(255) not null,
	description text,
	completed	boolean not null default false,
	due_date date,
	created_at	timestamp not null default current_timestamp,
	updated_at timestamp not null default current_timestamp on update current_timestamp,
	foreign key (user_id) references users(id) on delete cascade
);

create table if not exists tags (
	id char(36) primary key default(uuid()),
	user_id char(36) not null,
	name varchar(50) not null,
	foreign key (user_id) references users(id) on delete cascade,
	unique(user_id, name)
);

create table if not exists todo_tags (
	todo_id char(36) not null,
	tag_id char(36) not null,
	primary key(todo_id, tag_id),
	foreign key (todo_id) references todos(id) on delete cascade,
	foreign key (tag_id) references tags(id) on delete cascade
);