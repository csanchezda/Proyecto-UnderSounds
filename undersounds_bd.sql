-- ====================
-- DROP TABLES (orden correcto por dependencias)
-- ====================
DROP TABLE IF EXISTS public."ModificationAlbumSongRelation" CASCADE;
DROP TABLE IF EXISTS public."GenreSongRelation" CASCADE;
DROP TABLE IF EXISTS public."AlbumSongRelation" CASCADE;
DROP TABLE IF EXISTS public."ModificationAlbum" CASCADE;
DROP TABLE IF EXISTS public."ModificationSong" CASCADE;
DROP TABLE IF EXISTS public."Follower" CASCADE;
DROP TABLE IF EXISTS public."FavSongs" CASCADE;
DROP TABLE IF EXISTS public."FavAlbums" CASCADE;
DROP TABLE IF EXISTS public."ShoppingCart" CASCADE;
DROP TABLE IF EXISTS public."Review" CASCADE;
DROP TABLE IF EXISTS public."Orders" CASCADE;
DROP TABLE IF EXISTS public."Product" CASCADE;
DROP TABLE IF EXISTS public."Album" CASCADE;
DROP TABLE IF EXISTS public."Songs" CASCADE;
DROP TABLE IF EXISTS public."Genre" CASCADE;
DROP TABLE IF EXISTS public."User" CASCADE;

-- ====================
-- CREATE TABLES
-- ====================

-- 1. User
CREATE TABLE public."User" (
    "idUser" INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "userName" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "followerNumber" INTEGER NOT NULL DEFAULT 0,
    "description" TEXT NOT NULL DEFAULT 'Sin descripción',
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "nationality" TEXT NOT NULL,
    "isArtist" BOOLEAN NOT NULL DEFAULT FALSE,
    "profilePicture" TEXT,
	CONSTRAINT "uq_user_email" UNIQUE(email),
    CONSTRAINT "uq_user_name" UNIQUE("userName")
);

-- 2. Songs
CREATE TABLE public."Songs" (
    "idSong" INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "idUser" INTEGER NOT NULL REFERENCES public."User"("idUser") ON DELETE CASCADE,
    "name" TEXT NOT NULL,
	"description" TEXT NOT NULL DEFAULT 'Sin descripción',
    "songDuration" TEXT NULL,
	"price" REAL NOT NULL,
    "songReleaseDate" DATE NOT NULL,
    "thumbnail" TEXT,
    "wav" TEXT,
    "flac" TEXT,
    "mp3" TEXT,
    "views" INTEGER NOT NULL DEFAULT 0,
	"isVisible" BOOLEAN NOT NULL DEFAULT TRUE,
	CONSTRAINT "chk_song_format_presence" CHECK (
		wav IS NOT NULL OR flac IS NOT NULL OR mp3 IS NOT NULL
	),
	CONSTRAINT "chk_positive_price" CHECK ("price" > 0)

);

-- 3. Genre
CREATE TABLE public."Genre" (
    "idGenre" INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "genreName" TEXT NOT NULL,
	CONSTRAINT "uq_genre_name" UNIQUE("genreName")
);

-- 4. Album
CREATE TABLE public."Album" (
    "idAlbum" INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "idUser" INTEGER NOT NULL REFERENCES public."User"("idUser") ON DELETE CASCADE,
    "name" TEXT NOT NULL,
	"description" TEXT NOT NULL DEFAULT 'Sin descripción',
	"price" REAL NOT NULL,
    "totalDuration" TEXT NOT NULL,
    "albumThumbnail" TEXT NOT NULL,
    "albumRelDate" DATE NOT NULL DEFAULT CURRENT_DATE,
    "wav" TEXT,
    "flac" TEXT,
    "mp3" TEXT,
    "totalViews" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT chk_album_formats CHECK (
        wav IS NOT NULL OR flac IS NOT NULL OR mp3 IS NOT NULL
    ),
	CONSTRAINT "chk_positive_price" CHECK ("price" > 0)

);

-- 5. Product
CREATE TABLE public."Product" (
    "idProduct" INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "isSong" BOOLEAN NOT NULL,
    "idSong" INTEGER,
    "idAlbum" INTEGER,
    CONSTRAINT "fk_idAlbum" FOREIGN KEY ("idAlbum") REFERENCES public."Album"("idAlbum") ON DELETE CASCADE,
    CONSTRAINT "fk_idSong" FOREIGN KEY ("idSong") REFERENCES public."Songs"("idSong") ON DELETE CASCADE,
    CONSTRAINT "chk_product_type_match" CHECK (
        ("isSong" = TRUE AND "idSong" IS NOT NULL AND "idAlbum" IS NULL) OR
        ("isSong" = FALSE AND "idAlbum" IS NOT NULL AND "idSong" IS NULL)
    )
);

-- 6. Orders
CREATE TABLE public."Orders" (
    "idOrder" INTEGER GENERATED ALWAYS AS IDENTITY,
    "idUser" INTEGER NOT NULL,
    "idProduct" INTEGER NOT NULL,
    PRIMARY KEY ("idOrder"),
	CONSTRAINT "uq_user_product" UNIQUE ("idUser", "idProduct"),
	FOREIGN KEY ("idUser") REFERENCES public."User"("idUser") ON DELETE CASCADE,
    FOREIGN KEY ("idProduct") REFERENCES public."Product"("idProduct") ON DELETE CASCADE
);

-- 7. Review
CREATE TABLE public."Review" (
    "idReview" INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "idProduct" INTEGER NOT NULL REFERENCES public."Product"("idProduct") ON DELETE CASCADE,
    "idUser" INTEGER NOT NULL REFERENCES public."User"("idUser") ON DELETE CASCADE,
    "comment" TEXT NOT NULL,
    "rating" REAL NOT NULL,
    "publishDate" DATE NOT NULL DEFAULT CURRENT_DATE,
    CONSTRAINT "chk_rating_range" CHECK (rating >= 1 AND rating <= 5)
);

-- 8. ShoppingCart
CREATE TABLE public."ShoppingCart" (
    "idUser" INTEGER NOT NULL,
    "idProduct" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    PRIMARY KEY ("idUser", "idProduct"),
    FOREIGN KEY ("idUser") REFERENCES public."User"("idUser") ON DELETE CASCADE,
    FOREIGN KEY ("idProduct") REFERENCES public."Product"("idProduct") ON DELETE CASCADE
);

-- 9. FavAlbums
CREATE TABLE public."FavAlbums" (
    "idAlbum" INTEGER NOT NULL,
    "idUser" INTEGER NOT NULL,
    PRIMARY KEY ("idAlbum", "idUser"),
    FOREIGN KEY ("idAlbum") REFERENCES public."Album"("idAlbum") ON DELETE CASCADE,
    FOREIGN KEY ("idUser") REFERENCES public."User"("idUser") ON DELETE CASCADE
);

-- 10. FavSongs
CREATE TABLE public."FavSongs" (
    "idSong" INTEGER NOT NULL,
    "idUser" INTEGER NOT NULL,
    PRIMARY KEY ("idSong", "idUser"),
    FOREIGN KEY ("idSong") REFERENCES public."Songs"("idSong") ON DELETE CASCADE,
    FOREIGN KEY ("idUser") REFERENCES public."User"("idUser") ON DELETE CASCADE
);

-- 11. Follower
CREATE TABLE public."Follower" (
    "idFollower" INTEGER NOT NULL,
	"idFollowed" INTEGER NOT NULL,
    PRIMARY KEY ("idFollower", "idFollowed"),
    FOREIGN KEY ("idFollower") REFERENCES public."User"("idUser") ON DELETE CASCADE,
    FOREIGN KEY ("idFollowed") REFERENCES public."User"("idUser") ON DELETE CASCADE,
    CONSTRAINT "chk_no_self_follow" CHECK ("idFollower" <> "idFollowed")
);

-- 12. ModificationSong
CREATE TABLE public."ModificationSong" (
    "idModification" INTEGER GENERATED ALWAYS AS IDENTITY,
    "idSong" INTEGER NOT NULL,
    "modificationDate" DATE NOT NULL DEFAULT CURRENT_DATE,
    "songDuration" TEXT,
    "songReleaseDate" DATE,
	"price" REAL NOT NULL,
    "thumbnail" TEXT,
    "wav" TEXT,
    "flac" TEXT,
    "mp3" TEXT,
    "description" TEXT,
    PRIMARY KEY ("idModification", "idSong"),
    FOREIGN KEY ("idSong") REFERENCES public."Songs"("idSong") ON DELETE CASCADE
);


-- 13. ModificationAlbum
CREATE TABLE public."ModificationAlbum" (
    "idModification" INTEGER GENERATED ALWAYS AS IDENTITY,
    "idAlbum" INTEGER NOT NULL,
    "modificationDate" DATE NOT NULL DEFAULT CURRENT_DATE,
    "totalDuration" TEXT,
    "albumThumbnail" TEXT,
    "albumRelDate" DATE,
	"price" REAL NOT NULL,
    "wav" TEXT,
    "flac" TEXT,
    "mp3" TEXT,
    PRIMARY KEY ("idModification", "idAlbum"),
    FOREIGN KEY ("idAlbum") REFERENCES public."Album"("idAlbum") ON DELETE CASCADE
);


-- 14. AlbumSongRelation
CREATE TABLE public."AlbumSongRelation" (
    "idAlbum" INTEGER NOT NULL,
    "idSong" INTEGER NOT NULL,
    PRIMARY KEY ("idAlbum", "idSong"),
    FOREIGN KEY ("idAlbum") REFERENCES public."Album"("idAlbum") ON DELETE CASCADE,
    FOREIGN KEY ("idSong") REFERENCES public."Songs"("idSong") ON DELETE CASCADE
);

-- 15. GenreSongRelation
CREATE TABLE public."GenreSongRelation" (
    "idSong" INTEGER NOT NULL,
    "idGenre" INTEGER NOT NULL,
    PRIMARY KEY ("idSong", "idGenre"),
    FOREIGN KEY ("idSong") REFERENCES public."Songs"("idSong") ON DELETE CASCADE,
    FOREIGN KEY ("idGenre") REFERENCES public."Genre"("idGenre") ON DELETE CASCADE
);

-- 16. ModificationAlbumSongRelation
CREATE TABLE public."ModificationAlbumSongRelation" (
    "idModification" INTEGER NOT NULL,
    "idAlbum" INTEGER NOT NULL,
    "idSong" INTEGER NOT NULL,
    PRIMARY KEY ("idModification", "idAlbum", "idSong"),
    FOREIGN KEY ("idModification", "idAlbum") REFERENCES public."ModificationAlbum"("idModification", "idAlbum") ON DELETE CASCADE,
    FOREIGN KEY ("idSong") REFERENCES public."Songs"("idSong") ON DELETE CASCADE
);



-- Trigger Artista is True
CREATE OR REPLACE FUNCTION check_user_is_artist_song()
RETURNS TRIGGER AS $$
BEGIN
    -- Verificar que el usuario sea un artista
    IF NOT EXISTS (
        SELECT 1
        FROM public."User"
        WHERE "idUser" = NEW."idUser" AND "isArtist" = TRUE
    ) THEN
        RAISE EXCEPTION 'El usuario debe ser un artista para agregar canciones.';
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Crear el trigger en la tabla Songs
CREATE TRIGGER trigger_check_user_is_artist_song
    BEFORE INSERT ON public."Songs"
    FOR EACH ROW
    EXECUTE FUNCTION check_user_is_artist_song();

CREATE OR REPLACE FUNCTION check_user_is_artist_album()
RETURNS TRIGGER AS $$
BEGIN
    -- Verificar que el usuario sea un artista
    IF NOT EXISTS (
        SELECT 1
        FROM public."User"
        WHERE "idUser" = NEW."idUser" AND "isArtist" = TRUE
    ) THEN
        RAISE EXCEPTION 'El usuario debe ser un artista para agregar álbumes.';
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Crear el trigger en la tabla Album
CREATE TRIGGER trigger_check_user_is_artist_album
    BEFORE INSERT ON public."Album"
    FOR EACH ROW
    EXECUTE FUNCTION check_user_is_artist_album();


-- Función para actualizar followerNumber
CREATE OR REPLACE FUNCTION update_follower_count()
RETURNS TRIGGER AS $$
BEGIN
    -- Al insertar, incrementa en 1
    IF TG_OP = 'INSERT' THEN
        UPDATE public."User"
        SET "followerNumber" = "followerNumber" + 1
        WHERE "idUser" = NEW."idFollowed";
    END IF;

    -- Al borrar, decrementa en 1
    IF TG_OP = 'DELETE' THEN
        UPDATE public."User"
        SET "followerNumber" = "followerNumber" - 1
        WHERE "idUser" = OLD."idFollowed";
    END IF;

    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger en la tabla Follower
CREATE TRIGGER trg_update_follower_count
AFTER INSERT OR DELETE ON public."Follower"
FOR EACH ROW
EXECUTE FUNCTION update_follower_count();

-- MODIFICATONS
-- Trigger para guardar los cambios antiguos de un álbum antes de actualizar
CREATE OR REPLACE FUNCTION save_album_changes() 
RETURNS TRIGGER AS $$ 
BEGIN 
    -- Guardar los valores actuales del álbum en la tabla de modificaciones
    INSERT INTO public."ModificationAlbum" (
        "idAlbum", 
        "modificationDate", 
        "totalDuration", 
        "albumThumbnail", 
        "albumRelDate", 
        "price", 
        "wav", 
        "flac", 
        "mp3"
    ) 
    VALUES ( 
        OLD."idAlbum", 
        CURRENT_DATE, 
        OLD."totalDuration", 
        OLD."albumThumbnail", 
        OLD."albumRelDate", 
        OLD."price", 
        OLD."wav", 
        OLD."flac", 
        OLD."mp3"
    );

    -- También guardamos las canciones asociadas al álbum en la relación de modificación
    INSERT INTO public."ModificationAlbumSongRelation" (
        "idModification", 
        "idAlbum", 
        "idSong"
    ) 
    SELECT 
        currval('public."ModificationAlbum_idModification_seq"'), 
        OLD."idAlbum", 
        "idSong"
    FROM public."AlbumSongRelation"
    WHERE "idAlbum" = OLD."idAlbum";

    -- Marcar las canciones asociadas con este álbum como no visibles
    UPDATE public."Songs"
    SET "isVisible" = FALSE
    WHERE "idSong" IN (
        SELECT "idSong"
        FROM public."AlbumSongRelation"
        WHERE "idAlbum" = OLD."idAlbum"
    );

    -- Eliminar las relaciones de canciones con el álbum modificado
    DELETE FROM public."AlbumSongRelation"
    WHERE "idAlbum" = OLD."idAlbum";

    -- Devolver la nueva fila para que se pueda realizar la actualización
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Crear el trigger que ejecuta la función cuando se actualiza un álbum
CREATE TRIGGER trigger_save_album_changes
    BEFORE UPDATE ON public."Album"
    FOR EACH ROW
    EXECUTE FUNCTION save_album_changes();

-- Trigger para guardar los cambios antiguos de una canción antes de actualizar
CREATE OR REPLACE FUNCTION save_song_changes() 
RETURNS TRIGGER AS $$ 
BEGIN 
    -- Guardar los valores actuales de la canción en la tabla de modificaciones
    INSERT INTO public."ModificationSong" (
        "idSong", 
        "modificationDate", 
        "songDuration", 
        "songReleaseDate", 
        "price", 
        "thumbnail", 
        "wav", 
        "flac", 
        "mp3", 
        "description"
    ) 
    VALUES ( 
        OLD."idSong", 
        CURRENT_DATE, 
        OLD."songDuration", 
        OLD."songReleaseDate", 
        OLD."price", 
        OLD."thumbnail", 
        OLD."wav", 
        OLD."flac", 
        OLD."mp3", 
        OLD."description"
    );

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Crear el trigger que ejecuta la función cuando se actualiza una canción
CREATE TRIGGER trigger_save_song_changes
    BEFORE UPDATE ON public."Songs"
    FOR EACH ROW
    EXECUTE FUNCTION save_song_changes();

-- Trigger para restaurar los valores antiguos de una canción
CREATE OR REPLACE FUNCTION restore_song_from_history() 
RETURNS TRIGGER AS $$ 
BEGIN 
    -- Restaurar los datos de la canción desde la modificación
    UPDATE public."Songs"
    SET 
        "songDuration" = OLD."songDuration",
        "songReleaseDate" = OLD."songReleaseDate",
        "price" = OLD."price",
        "thumbnail" = OLD."thumbnail",
        "wav" = OLD."wav",
        "flac" = OLD."flac",
        "mp3" = OLD."mp3",
        "description" = OLD."description",
        "isVisible" = TRUE  -- Restaurar la visibilidad de la canción
    WHERE "idSong" = OLD."idSong";

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Crear el trigger que ejecuta la función cuando se restaura una canción desde el historial
CREATE TRIGGER trigger_restore_song_from_history
    AFTER INSERT ON public."ModificationSong"
    FOR EACH ROW
    EXECUTE FUNCTION restore_song_from_history();
	
-- RESTAURAR
-- Función para restaurar los valores antiguos de una canción
CREATE OR REPLACE FUNCTION fuction_restore_song_from_history(
    _idModification INTEGER,  -- id de modificación
    _idSong INTEGER           -- id de la canción
)
RETURNS VOID AS $$
DECLARE
    v_songDuration INTERVAL;
    v_songReleaseDate DATE;
    v_price NUMERIC;
    v_thumbnail TEXT;
    v_wav TEXT;
    v_flac TEXT;
    v_mp3 TEXT;
    v_description TEXT;
BEGIN
    -- Obtener los datos de la modificación
    SELECT 
        "songDuration",
        "songReleaseDate",
        "price",
        "thumbnail",
        "wav",
        "flac",
        "mp3",
        "description"
    INTO 
        v_songDuration,
        v_songReleaseDate,
        v_price,
        v_thumbnail,
        v_wav,
        v_flac,
        v_mp3,
        v_description
    FROM public."ModificationSong"
    WHERE "idModification" = _idModification
      AND "idSong" = _idSong;

    -- Restaurar los datos en la tabla Songs
    UPDATE public."Songs"
    SET 
        "songDuration" = v_songDuration,
        "songReleaseDate" = v_songReleaseDate,
        "price" = v_price,
        "thumbnail" = v_thumbnail,
        "wav" = v_wav,
        "flac" = v_flac,
        "mp3" = v_mp3,
        "description" = v_description,
        "isVisible" = TRUE
    WHERE "idSong" = _idSong;
    
EXCEPTION
    WHEN NO_DATA_FOUND THEN
        RAISE EXCEPTION 'No existe una modificación para la canción con idSong = % y idModification = %', _idSong, _idModification;
END;
$$ LANGUAGE plpgsql;

-- Función para restaurar los valores antiguos de un álbum y sus canciones
CREATE OR REPLACE FUNCTION fuction_restore_album_from_history(
    _idModification INTEGER,  -- id de modificación
    _idAlbum INTEGER          -- id del álbum
)
RETURNS VOID AS $$
DECLARE
    v_totalDuration INTERVAL;
    v_albumThumbnail TEXT;
    v_albumRelDate DATE;
    v_price NUMERIC;
    v_wav TEXT;
    v_flac TEXT;
    v_mp3 TEXT;
BEGIN
    -- Obtener los datos de la modificación del álbum
    SELECT 
        "totalDuration",
        "albumThumbnail",
        "albumRelDate",
        "price",
        "wav",
        "flac",
        "mp3"
    INTO 
        v_totalDuration,
        v_albumThumbnail,
        v_albumRelDate,
        v_price,
        v_wav,
        v_flac,
        v_mp3
    FROM public."ModificationAlbum"
    WHERE "idModification" = _idModification
      AND "idAlbum" = _idAlbum;

    -- Restaurar los datos del álbum
    UPDATE public."Album"
    SET 
        "totalDuration" = v_totalDuration,
        "albumThumbnail" = v_albumThumbnail,
        "albumRelDate" = v_albumRelDate,
        "price" = v_price,
        "wav" = v_wav,
        "flac" = v_flac,
        "mp3" = v_mp3
    WHERE "idAlbum" = _idAlbum;

    -- Restaurar la visibilidad de las canciones asociadas al álbum
    UPDATE public."Songs"
    SET "isVisible" = TRUE
    WHERE "idSong" IN (
        SELECT "idSong"
        FROM public."ModificationAlbumSongRelation"
        WHERE "idModification" = _idModification
          AND "idAlbum" = _idAlbum
    );

    -- Restaurar las relaciones entre el álbum y sus canciones
    INSERT INTO public."AlbumSongRelation" ("idAlbum", "idSong")
    SELECT "idAlbum", "idSong"
    FROM public."ModificationAlbumSongRelation"
    WHERE "idModification" = _idModification
      AND "idAlbum" = _idAlbum;

EXCEPTION
    WHEN NO_DATA_FOUND THEN
        RAISE EXCEPTION 'No existe una modificación para el álbum con idAlbum = % y idModification = %', _idAlbum, _idModification;
END;
$$ LANGUAGE plpgsql;

-- Actualiza followerNumber según el número real de seguidores en la tabla Follower
UPDATE public."User" u
SET "followerNumber" = sub.count
FROM (
    SELECT "idFollowed", COUNT(*) AS count
    FROM public."Follower"
    GROUP BY "idFollowed"
) sub
WHERE u."idUser" = sub."idFollowed";

UPDATE public."User"
SET "followerNumber" = 0
WHERE "idUser" NOT IN (
    SELECT DISTINCT "idFollowed"
    FROM public."Follower"
);


