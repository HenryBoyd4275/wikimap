--seed the db with some default map data
INSERT INTO maps (owner_id, title) VALUES
(1, 'default'),
(1, 'Eats'),
(1, 'shop'),
(1, 'play'),
(2, 'empty');

INSERT INTO points (map_id, title, description, image_url, lat, lng)
VALUES
(1, 'Lighthouse Labs', 'Learn2Code', 'https://pngimg.com/uploads/rubber_duck/rubber_duck_PNG54.png', 43.6442, -79.4022),
(1, 'secret base', 'Super Secret Base', NULL, 43.7756, -79.2779),
(2, 'Burger Thing', 'get the 2 for $7', NULL, 43.6542, -79.4422),
(2, 'Sandwich Monarch', 'Your liege makes good food', NULL, 43.6642, -79.4722),
(2, 'McSandwitch', '*Not actually Scottish*', NULL, 43.6742, -79.4222),
(3, 'World of hats', 'They sell headwear', NULL, 43.6342, -79.4522),
(3, 'Hats and more', 'They sell hats... and more!', NULL, 43.6442, -79.4622),
(3, 'Just hats', 'Exactly what you think it is', NULL,  43.6742, -79.4422),
(3, 'You will not believe we sell hats!', 'Actually very believable', NULL, 43.6242, -79.4322),
(4, 'Fun Fun Functions', 'FUN FUN FUN FUN', NULL, 43.6942, -79.4922),
(4, 'Loopy Lighthouse', '100, 101, 102...', NULL, 43.6542, -79.4422);

INSERT INTO favourite_maps (user_id, map_id)
VALUES
(2, 1),
(3, 1);
