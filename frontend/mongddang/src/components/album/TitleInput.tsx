import './TitleInput.css';

interface TitleInputProps {
  title: string;
  onChange: (value: string) => void;
}

const TitleInput = ({ title, onChange }: TitleInputProps) => {
  return (
    <div className='title-input'>
      <input
        type="text"
        id="title"
        value={title}
        onChange={(e) => onChange(e.target.value)}
        placeholder="앨범 제목을 입력하세요"
      />
    </div>
  );
};
export default TitleInput;

