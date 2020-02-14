--seed the db with some default map data
INSERT INTO maps (owner_id, title) VALUES
(1, 'SecretBases'),
(1, 'Eats'),
(1, 'shop'),
(1, 'play'),
(2, 'empty');

INSERT INTO points (map_id, title, description, image_url, lat, lng)
VALUES
(1, 'Super Secret base', 'Super Secret Base', 'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcTj-gukAJDQAauw4YK26t8MuLNPAITYCMiP9w-mLU5vBzqYCii_', 43.66588482492509, -79.47235107),
(1, 'Secret base', 'Secret Base', 'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcSj6expPawMUV4Hpg1sqaV2Pp3s6kjy3IxSy53j4OhzI5kRD1Uk', 43.667747685099805, -79.34150056225508),
(1, 'Secret Lair', 'Secret Lair', 'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcR-qLIMDv2Lgf6i_iwuzpVrZnjiTqUuIk2OHRs6Ojw33mD3c1uK', 43.71441830235925, -79.50560883862227),
(1, 'Party House', 'Party!', 'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcR-qLIMDv2Lgf6i_iwuzpVrZnjiTqUuIk2OHRs6Ojw33mD3c1uK', 43.72086989076358, -79.31266145092695),
(1, 'Secret Super Base', 'Secret Super Base', 'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcR-qLIMDv2Lgf6i_iwuzpVrZnjiTqUuIk2OHRs6Ojw33mD3c1uK', 43.77158964882741, -79.420166015625),
(2, 'Burger Thing', '🌟🌟🌟☆☆      Get the 2 for $7', 'http://www.wackypackages.org/stickers/85_topps/4_front_burger_thing_small.jpg', 43.6842, -79.4422),
(2, 'Sandwich Monarch', '🌟🌟☆☆☆ Your liege makes good food', 'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQVl7SAIhiweYCpjdTw-fAS6p8HEva7xucagF9eClSZO_iCtFAL', 43.6142, -79.4722),
(2, 'McSandwitch', '🌟🌟🌟🌟☆Not actually Scottish*', 'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcSbJUF4PW81KuAbCW58_PP_VMD8ChfdclyxE_AYUoWYoU3RHCR2', 43.7742, -79.4222),
(2, 'Rumours Restaurant & Lounge', '🌟🌟🌟🌟🌟 Use Coupon Code:50off', 'https://www.seriouseats.com/recipes/images/2016/06/20110516-cowboy-steak-kenji-lopez-alt-1500x1125.jpg', 43.6442, -79.4022),
(3, 'World of hats', 'They sell headwear', 'https://media-cdn.tripadvisor.com/media/photo-s/06/47/de/60/museum-the-world-of-hat.jpg', 43.6342, -79.4522),
(3, 'Hats and more', 'They sell hats... and more!', 'https://tinyurl.com/vqscnyl', 43.6442, -79.4622),
(3, 'Just hats', 'Exactly what you think it is', 'https://images.customplanet.com/designs/templates/F02FB67F-BF64-47B9-80E9-BDB2F0142989/main/Front/e3808c25-c4c9-42fb-ad60-9d711e0e5151.png',  43.6742, -79.4422),
(3, 'You will not believe we sell hats!', 'Actually very believable', 'https://media.gq.com/photos/5c4a32ec148f7b356e1beb87/3:2/w_1998,h_1332,c_limit/MAGA-Evil-Hat-GQ-01242019_3x2.jpg', 43.6242, -79.4322),
(4, 'Fun Fun Functions', 'FUN FUN FUN FUN', 'https://hackernoon.com/hn-images/1*03y1jp5rJOkrpd3EZmO7aQ.jpeg', 43.6942, -79.4922),
(4, 'Loopy Lighthouse', '100, 101, 102...', 'https://i.pinimg.com/originals/5f/81/78/5f817899f0a1adc0805c16ce8796d456.jpg', 43.6542, -79.4422),
(4, 'Infinite Recursion', 'To infinity and beyond!!', 'https://external-preview.redd.it/wMHi2fEKvNunQuUH8FAByCUrzv8dlvlxv8rRaXj9UQg.jpg?auto=webp&s=9ec2fdd3534de10fa7589d3e414425aca2480f99', 43.7542, -79.4222);


INSERT INTO favourite_maps (user_id, map_id)
VALUES
(2, 1),
(3, 1);
