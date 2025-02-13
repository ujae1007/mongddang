import "./PlatListItem.css";

// PlaylistItem.tsx
interface PlaylistItemProps {
  playlist: {
    playlistId: number;
    photos: string[];
    placeName: string;
    music: string;
  };
  index: number;
  onEdit: (playlist: any) => void;
  onDelete: (playlistId: number) => void;
  isDeleting: boolean;
}

function PlaylistItem({ playlist, index, onEdit, onDelete, isDeleting }: PlaylistItemProps) {
  return (
    <div className="playlist-item">

      <div className="photo-section">
        {playlist.photos && playlist.photos.map((photo, photoIndex) => (
          <img
            key={`${playlist.playlistId}-photo-${photoIndex}`}
            src={photo}
            alt={`Track ${index + 1} Photo ${photoIndex + 1}`}
            onClick={() => onEdit(playlist)}
          />
        ))}
      </div>

      <div className="info-section">
        <div className="place-info">{playlist.placeName}</div>
        <div className="music-info">{playlist.music}</div>
      </div>

      <div className="delete-section">
        <button
          className="delete-button"
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