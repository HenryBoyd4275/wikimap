--seed the db with some default data
INSERT INTO maps (owner_id, title) VALUES (1, 'default');

INSERT INTO points (map_id, title, description, image_url, lat, lng)
VALUES
(1, 'Lighthouse Labs', 'description', 'https://pngimg.com/uploads/rubber_duck/rubber_duck_PNG54.png', 43.6442, -79.4022),
(1, 'secret base', 'description', NULL, 43.7756, -79.2579);
