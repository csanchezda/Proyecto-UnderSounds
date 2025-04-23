INSERT INTO public."User" ("userName","name", "description", "email", "password", "nationality", "isArtist", "profilePicture") VALUES
('ArtistOne', 'Artist One','Cantante pop', 'artist1@example.com', 'password1', 'Spain', TRUE, 'images/profile/artist1.jpg'),
('FanUser1','Fan User 1', 'Amante del rock', 'fan1@example.com', 'password2', 'Mexico', FALSE, 'images/profile/fan1.jpg'),
('ArtistTwo', 'Artist Two','DJ de electrónica', 'artist2@example.com', 'password3', 'UK', TRUE, 'images/profile/artist2.jpg'),
('FanUser2', 'Fan User 2','Melómano curioso', 'fan2@example.com', 'password4', 'France', FALSE, 'images/profile/fan2.jpg'),
('ArtistThree', 'Artist Three','Cantautor indie', 'artist3@example.com', 'password5', 'Germany', TRUE, 'images/profile/artist3.jpg'),
('FanUser3', 'Fan User 3','Explorador musical', 'fan3@example.com', 'password6', 'Italy', FALSE, 'images/profile/fan3.jpg'),
('ArtistFour', 'Artist Four','Productor techno', 'artist4@example.com', 'password7', 'Venezuela', TRUE, 'images/profile/artist4.jpg'),
('FanUser4', 'Fan User 4','Fan de jazz', 'fan4@example.com', 'password8', 'Japan', FALSE, 'images/profile/fan4.jpg'),
('ArtistFive', 'Artist Five','Dúo urbano', 'artist5@example.com', 'password9', 'USA', TRUE, 'images/profile/artist5.jpg'),
('FanUser5', 'Fan User 5','Fiel oyente', 'fan5@example.com', 'password10', 'Spain', FALSE, 'images/profile/fan5.jpg');

INSERT INTO public."Songs" ("idUser", "description", "songDuration", "price", "songReleaseDate", "thumbnail", "wav", "flac", "mp3") VALUES
(1, 'Song description 1', '2:13', 2.94, '2023-05-16', 'images/song/song1.jpg', 'audio/song/wav/song1.wav', 'audio/song/flac/song1.flac', 'audio/song/mp3/song1.mp3'),
(7, 'Song description 2', '2:11', 2.67, '2024-02-21', 'images/song/song2.jpg', 'audio/song/wav/song2.wav', 'audio/song/flac/song2.flac', ' audio/song/mp3/song2.mp3'),
(1, 'Song description 3', '3:10', 1.14, '2023-09-28', ' images/song/song3.jpg', ' audio/song/wav/song3.wav', ' audio/song/flac/song3.flac', ' audio/song/mp3/song3.mp3'),
(5, 'Song description 4', '4:22', 2.05, '2022-01-21', ' images/song/song4.jpg', ' audio/song/wav/song4.wav', 'audio/song/flac/song4.flac', 'audio/song/mp3/song4.mp3'),
(5, 'Song description 5', '2:00', 2.18, '2024-01-20', 'images/song/song5.jpg', 'audio/song/wav/song5.wav', 'audio/song/flac/song5.flac', 'audio/song/mp3/song5.mp3'),
(1, 'Song description 6', '2:49', 1.51, '2023-02-18', 'images/song/song6.jpg', 'audio/song/wav/song6.wav', 'audio/song/flac/song6.flac', 'audio/song/mp3/song6.mp3'),
(7, 'Song description 7', '4:47', 2.79, '2023-12-05', 'images/song/song7.jpg', 'audio/song/wav/song7.wav', 'audio/song/flac/song7.flac', 'audio/song/mp3/song7.mp3'),
(3, 'Song description 8', '4:27', 2.57, '2022-11-06', 'images/song/song8.jpg', 'audio/song/wav/song8.wav', 'audio/song/flac/song8.flac', 'audio/song/mp3/song8.mp3'),
(5, 'Song description 9', '3:32', 1.51, '2022-09-04', 'images/song/song9.jpg', 'audio/song/wav/song9.wav', 'audio/song/flac/song9.flac', 'audio/song/mp3/song9.mp3'),
(3, 'Song description 10', '2:43', 2.09, '2024-12-16', 'images/song/song10.jpg', 'audio/song/wav/song10.wav', 'audio/flac/song10.flac', 'audio/song/mp3/song10.mp3');

INSERT INTO public."Album" ("idUser", "description", "price", "totalDuration", "albumThumbnail", "albumRelDate", "wav", "flac", "mp3") VALUES
( 1, 'Descripción del álbum 1', 8.17, '31:46', 'images/album/album1.jpg', '2024-05-21', 'audio/album/wav/album1.wav', 'audio/album/flac/album1.flac', 'audio/album/mp3/album1.mp3'),
( 9, 'Descripción del álbum 2', 8.47, '41:01', 'images/album/album2.jpg', '2022-08-11', 'audio/album/wav/album2.wav', 'audio/album/flac/album2.flac', 'audio/album/mp3/album2.mp3'),
(9, 'Descripción del álbum 3', 7.32, '20:31', 'images/album/album3.jpg', '2024-02-01', 'audio/album/wav/album3.wav', 'audio/album/flac/album3.flac', 'audio/album/mp3/album3.mp3'),
( 5, 'Descripción del álbum 4', 9.13, '23:09', 'images/album/album4.jpg', '2024-12-15', 'audio/album/wav/album4.wav', 'audio/album/flac/album4.flac', 'audio/album/mp3/album4.mp3'),
(1, 'Descripción del álbum 5', 7.88, '31:18', 'images/album/album5.jpg', '2023-08-20', 'audio/album/wav/album5.wav', 'audio/album/flac/album5.flac', 'audio/album/mp3/album5.mp3'),
( 3, 'Descripción del álbum 6', 9.47, '46:16', 'images/album/album6.jpg', '2023-05-06', 'audio/album/wav/album6.wav', 'audio/album/flac/album6.flac', 'audio/album/mp3/album6.mp3'),
(9, 'Descripción del álbum 7', 9.89, '27:21', 'images/album/album7.jpg', '2024-07-22', 'audio/album/wav/album7.wav', 'audio/album/flac/album7.flac', 'audio/album/mp3/album7.mp3'),
(3, 'Descripción del álbum 8', 6.8, '42:59', 'images/album/album8.jpg', '2022-02-10', 'audio/album/wav/album8.wav', 'audio/album/flac/album8.flac', 'audio/album/mp3/album8.mp3'),
(9, 'Descripción del álbum 9', 6.79, '28:35', 'images/album/album9.jpg', '2024-02-11', 'audio/album/wav/album9.wav', 'audio/album/flac/album9.flac', 'audio/album/mp3/album9.mp3'),
(3, 'Descripción del álbum 10', 7.58, '32:46', 'images/album/album10.jpg', '2024-07-09', 'audio/album/wav/album10.wav', 'audio/album/flac/album10.flac', 'audio/album/mp3/album10.mp3');

INSERT INTO public."Product" ("isSong", "idSong", "idAlbum") VALUES
( TRUE, 1, NULL),
( TRUE, 2, NULL),
( TRUE, 3, NULL),
( TRUE, 4, NULL),
( TRUE, 5, NULL),
( TRUE, 6, NULL),
( TRUE, 7, NULL),
( TRUE, 8, NULL),
( TRUE, 9, NULL),
( TRUE, 10, NULL),
( FALSE, NULL, 1),
( FALSE, NULL, 2),
( FALSE, NULL, 3),
( FALSE, NULL, 4),
( FALSE, NULL, 5),
( FALSE, NULL, 6),
( FALSE, NULL, 7),
( FALSE, NULL, 8),
( FALSE, NULL, 9),
( FALSE, NULL, 10);

INSERT INTO public."AlbumSongRelation" ("idAlbum", "idSong") VALUES
(6, 1),
(10, 2),
(7, 3),
(8, 4),
(3, 5),
(8, 6),
(6, 7),
(4, 8),
(4, 9),
(2, 10);

INSERT INTO public."Genre" ("genreName") VALUES
('Pop'),
('Rock'),
('Electrónica'),
('Indie'),
('Jazz'),
('Hip-hop'),
('Clásica'),
('Reggaeton'),
('Country');


INSERT INTO public."GenreSongRelation" ("idSong", "idGenre") VALUES
(1, 4),
(2, 9),
(3, 6),
(4, 4),
(5, 5),
(6, 8),
(7, 4),
(8, 7),
(9, 7),
(10, 2),
(1, 8);

INSERT INTO public."Orders" ("idUser", "idProduct") VALUES
( 6, 1),
( 10, 2),
( 2, 8),
( 6, 6),
( 4, 8),
( 4, 2),
( 8, 6),
( 10, 3),
( 10, 19);

INSERT INTO public."Review" ( "idProduct", "idUser", "comment", "rating", "publishDate") VALUES
( 1, 6, 'Comentario 1', 3.8, '2023-04-18'),
( 2, 10, 'Comentario 2', 3.3, '2023-01-09'),
( 8, 2, 'Comentario 3', 3.6, '2024-01-10'),
( 6, 6, 'Comentario 4', 3.2, '2022-05-25'),
( 8, 4, 'Comentario 5', 4.4, '2023-04-01'),
( 2, 4, 'Comentario 6', 4.5, '2023-07-08'),
( 3, 10, 'Comentario 7', 2.9, '2024-08-05'),
( 6, 8, 'Comentario 8', 4.1, '2022-03-08'),
( 3, 10, 'Comentario 9', 3.4, '2024-09-22'),
( 19, 10, 'Comentario 10', 4.3, '2023-02-22');

INSERT INTO public."FavAlbums" ("idUser", "idAlbum") VALUES
(6, 3),
(2, 8),
(2, 6),
(6, 5),
(2, 7),
(10, 3),
(8, 3),
(10, 9),
(6, 6),
(8, 6);

INSERT INTO public."FavSongs" ("idUser", "idSong") VALUES
(4, 7),
(10, 8),
(8, 10),
(2, 7),
(6, 6),
(4, 6),
(10, 4),
(10, 9),
(10, 10),
(2, 1);

INSERT INTO public."Follower" ("idFollower", "idFollowed") VALUES
(7, 4),
(3, 6),
(9, 2),
(7, 9),
(5, 9),
(1, 4),
(10, 3),
(9, 7),
(6, 3),
(1, 9);

INSERT INTO public."ShoppingCart" ("idUser", "idProduct", "quantity") VALUES
(8, 20, 2),
(4, 11, 1),
(4, 4, 1),
(2, 6, 3),
(10, 11, 1),
(8, 18, 2),
(8, 4, 3),
(2, 2, 3),
(8, 11, 2);