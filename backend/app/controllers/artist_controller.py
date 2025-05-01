from fastapi import APIRouter, HTTPException, Query, Body
from typing import Optional, List
from app.models.user import User
from app.factories.postgres_factory import PostgresFactory
from app.schemas.user_schema import UserDTO, ArtistFilterDTO, AlbumDTO, SongDTO

router = APIRouter(prefix="/artists", tags=["Artists"])
artist_model = User(PostgresFactory())

@router.get("/", response_model=List[UserDTO])
def get_all_artists(nationalities: Optional[List[str]] = Query(default=None)):
    return artist_model.get_all_artists(nationalities=nationalities)



@router.get("/order/name", response_model=List[UserDTO])
def get_artists_ordered_by_name():
    return artist_model.get_artists_ordered_by_name()

@router.get("/order/followers", response_model=List[UserDTO])
def get_artists_ordered_by_followers():
    return artist_model.get_artists_ordered_by_followers()

@router.get("/order/views", response_model=List[UserDTO])
def get_artists_ordered_by_song_views():
    return artist_model.get_artists_ordered_by_song_views()


@router.post("/filter", response_model=List[UserDTO])
def get_artists_by_country_and_genre(filters: ArtistFilterDTO):
    return artist_model.get_artists_by_country_and_genre(filters.countries, filters.genres)


@router.get("/search", response_model=List[UserDTO])
def search_artists(name: str = Query(..., min_length=1)):
    return artist_model.search_artists_by_name(name)

@router.get("/{artist_id}/songs", response_model=List[SongDTO])
def get_songs_by_artist(artist_id: int):
    try:
        songs = artist_model.get_songs_by_artist(artist_id)
        return songs
    except Exception as e:
        print(f"❌ Error al obtener canciones: {e}")
        raise HTTPException(status_code=500, detail="Error interno al obtener canciones.")

@router.get("/{artist_id}/albums", response_model=List[AlbumDTO])
def get_albums_by_artist(artist_id: int):
    try:
        albums = artist_model.get_albums_by_artist(artist_id)
        return albums
    except Exception as e:
        print(f"❌ Error al obtener álbumes: {e}")
        raise HTTPException(status_code=500, detail="Error interno al obtener álbumes.")

@router.get("/filter", response_model=list[UserDTO])
def get_filtered_artists(
    name: Optional[str] = Query(None),
order: Optional[str] = Query(None)):
    valid_orders = {"name", "views", "followers"}
    if order and order not in valid_orders:
        raise HTTPException(status_code=400, detail="Orden inválido")

    return artist_model.get_filtered_artists(name, order)

@router.get("/{artist_id}", response_model=UserDTO)
def get_artist_by_id(artist_id: int):
    artist = artist_model.get_user_by_id(artist_id)
    if not artist or not artist.isArtist:
        raise HTTPException(status_code=404, detail="Artista no encontrado")
    return artist


