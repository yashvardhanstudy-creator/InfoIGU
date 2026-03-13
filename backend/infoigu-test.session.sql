CREATE TABLE IF NOT EXISTS publications {
    id int auto_increment primary key,
    publication varchar(255),
    ON DELETE CASCADE
};
