--seed the db with some default map data
INSERT INTO maps (owner_id, title) VALUES
(1, 'SecretBases'),
(1, 'Eats'),
(1, 'shop'),
(1, 'play'),
(2, 'empty');

INSERT INTO points (map_id, title, description, image_url, lat, lng)
VALUES
(1, 'Super Secret base', 'Super Secret Base', 'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcTj-gukAJDQAauw4YK26t8MuLNPAITYCMiP9w-mLU5vBzqYCii_', 43.71372346993974, -79.5111477678760),
(1, 'Secret base', 'Secret Base', 'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcSj6expPawMUV4Hpg1sqaV2Pp3s6kjy3IxSy53j4OhzI5kRD1Uk', 43.760903540859, -79.372445375),
(1, 'Secret Lair', 'Secret Lair', 'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcR-qLIMDv2Lgf6i_iwuzpVrZnjiTqUuIk2OHRs6Ojw33mD3c1uK', 43.717743153380, -79.405404359),
(1, 'Party House', 'Party!', 'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcR-qLIMDv2Lgf6i_iwuzpVrZnjiTqUuIk2OHRs6Ojw33mD3c1uK', 43.7672088788494, -79.517669677),
(1, 'Secret Super Base', 'Secret Super Base', 'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcR-qLIMDv2Lgf6i_iwuzpVrZnjiTqUuIk2OHRs6Ojw33mD3c1uK', 43.8149341395, -79.444543153),

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
