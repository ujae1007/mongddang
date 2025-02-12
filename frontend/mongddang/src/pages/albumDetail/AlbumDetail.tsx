import { useParams } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { albumListState } from '../../recoil/albumState';

import MapBox from '../../components/album/MapBox';


function AlbumDetail() {
  const { albumId } = useParams<{ albumId: string }>();
  const albumList = useRecoilValue(albumListState);
  
  // albumId를 사용하여 해당 앨범 찾기
  const album = albumList.find(album => album.id === parseInt(albumId || ''));

  console.log("앨범 정보", album);
  if (!album) {
    return <div>앨범을 찾을 수 없습니다.</div>;
  }

  return (
    <div>
      <h1>{album.title}</h1>
      <div>
        <h3> 지도 </h3>
        <MapBox playlists={album.playlists} />
      </div>

      <hr />
      <h3>플레이리스트 정보</h3>
      {album.playlists.map((playlist, index) => (
        <div key={playlist.playlistId || index}>
          <h3>트랙 {index + 1}</h3>
          <div>
            {playlist.photos && playlist.photos.map((photo, photoIndex) => (
              <img
                key={photoIndex}
                src={photo}
                alt={`Track ${index + 1} Photo ${photoIndex + 1}`}
                style={{ width: "100px", height: "100px", objectFit: "cover", margin: "5px" }}
              />
            ))}
          </div>
          <p>장소: {playlist.placeName}</p>
          <p>노래: {playlist.music}</p>
          <hr />
        </div>
      ))}
    </div>
  );
}

export default AlbumDetail;