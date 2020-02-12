--seed the db with some default data
INSERT INTO maps (owner_id, title) VALUES 
(1, 'default'),
(2, 'defaults');

INSERT INTO points (map_id, title, description, image_url, lat, lng)
VALUES
(1, 'Lighthouse Labs', 'Learn2Code', 'https://pngimg.com/uploads/rubber_duck/rubber_duck_PNG54.png', 43.6442, -79.4022),
(1, 'secret base', 'Super Secret Base', 'https://content.fortune.com/wp-content/uploads/2019/09/GettyImages-1171381030.jpg', 43.7756, -79.2579),
(2, 'Lighthouse Labs #2', 'description3', 'https://pngimg.com/uploads/rubber_duck/rubber_duck_PNG54.png', 43.6442, -79.4022),
(2, 'secret base #2', 'Extra Secret base', NULL, 43.7777, -79.2555);

