import "./PlayListItem.css";

interface PlaylistItemProps {
  playlist: {
    playlistId: number;
    photos: string[];
    placeName: string;
    music: string;
    musicId?: number; // 음악 ID도 함께 저장
    musicName?: string; // 출력용 음악 이름 (음악 - 가수)
  };
  index: number;
  onEdit: (playlist: any) => void;
  onDelete: (playlistId: number) => void;
  isDeleting: boolean;
}

function PlaylistItem({ playlist, index, onEdit, onDelete, isDeleting }: PlaylistItemProps) {
  return (
    <div className="playlistItem">

      <div className="photoSection">
        {playlist.photos && playlist.photos.length > 0 && (
            <img
              src={playlist.photos[0]}  // 첫 번째 사진만 표시
              alt={`Track ${index + 1} Photo`}
              onClick={() => onEdit(playlist)}
            />
          )}
      </div>

      <div className="infoSection">
        <div className="placeInfo">{playlist.placeName}</div>
        <div className="musicInfo">{playlist.music}</div>
      </div>

      <div className="deleteSection">
        <button
          className="deleteButton"
          onClick={() => onDelete(playlist.playlistId)}
          disabled={isDeleting}
        >
          ×
        </button>
      </div>
    </div>
  );
}

export default PlaylistItem;