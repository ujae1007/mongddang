import { useState, useEffect } from "react"
import './favoriteInput.css'

interface GenreOption {
  label: string;
  value: string;
}

interface FavoriteProps{
  type: "genre" | "place"
  placeholder: string
  onChange: (selecetedItem: string[]) => void
  defaultValues?: string[]
  mode: "signup" | "edit"
}

  const genreOptions: GenreOption[] = [
  { label: "케이팝", value: "k-pop" },
  { label: "팝", value: "pop" },
  { label: "재즈", value: "jazz" },
  { label: "락", value: "rock" },
  { label: "인디", value: "indie" },
  { label: "클래식", value: "classical" },
  { label: "제이팝", value: "j-pop" },
  { label: "댄스", value: "dance" },
  { label: "얼터너티브", value: "alternative" },
  { label: "메탈", value: "metal" },
  { label: "힙합", value: "hip-hop" },
  { label: "포크", value: "folk" },
  { label: "레게", value: "reggae" },
  { label: "하우스", value: "house" },
  { label: "컨트리", value: "country" },
  { label: "R&B", value: "r-n-b" },
  { label: "어쿠스틱", value: "acoustic" },
  { label: "블루스", value: "blues" },
  { label: "EDM", value: "edm" },
  { label: "뉴에이지", value: "new-age" },
];

const placeOptions: string[] = [
  "인천", "서울", "경기도", "강원도", "세종", "충청남도", "충청북도",
  "대전", "경상북도", "대구", "전라북도", "광주", "전라남도",
  "경상남도", "울산", "부산", "제주"
]

const FavoriteInput = ({type, placeholder, onChange, defaultValues =[], mode}: FavoriteProps) => {

  const options: GenreOption[] | string[] = type === "genre" ? genreOptions : placeOptions
  const [selectedItems, setSelectedItems ] = useState<string[]>([])

  //수정페이지라면 해당 데이터 보여주기 
  useEffect(() => {
    if(mode === "edit" && defaultValues.length > 0) {
      setSelectedItems(defaultValues)
    }
  }, [defaultValues, mode])


  const isGenreOption = (option: GenreOption | string): option is GenreOption => {
    return typeof option === 'object' && 'value' in option && 'label' in option;
  };


  // 선택한 항목 추가/삭제
  const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value
    if(!value) return 

    let newSelectedItems;

    if (selectedItems.includes(value)) {
      newSelectedItems = selectedItems.filter((item => item !== value))
    } else if (selectedItems.length <3) {
      newSelectedItems = ([...selectedItems, value])
    } else {
      alert("최대 3개까지 선택 가능합니다.")
      return
    }
    setSelectedItems(newSelectedItems)
    onChange(newSelectedItems)
  }

  // 개별 항목 삭제 
    const handleRemove = (itemToRemove: string) => {
      const newSelectedItems = selectedItems.filter((item) => item !== itemToRemove)
      setSelectedItems(newSelectedItems)
      onChange(newSelectedItems)
    }
    // 장르일 때와 장소일 때, 클래스명을 다르게 부여
    const wrapClassName = type === "genre"
    ? "SelectOptionWrap genreWrap"
    : "SelectOptionWrap placeWrap";

  return(

      <div className={wrapClassName}>
      <select onChange={handleSelect} value="">
        <option value="">{placeholder}</option>
        {options.map((option) =>
          isGenreOption(option) ? (
            <option 
              key={option.value} 
              value={option.value} 
              disabled={selectedItems.includes(option.value)}
            >
              {option.label}
            </option>
          ) : (
            <option 
              key={option} 
              value={option} 
              disabled={selectedItems.includes(option)}
            >
              {option}
            </option>
          )
        )}
      </select>

      <div className="selectedItemsWrap">
        {selectedItems.map(item => (
          <span key={item} style={{ marginRight: "8px" }}>
            {type === "genre" 
              ? genreOptions.find(opt => opt.value === item)?.label 
              : item
            }
            <button
              onClick={() => handleRemove(item)}
              style={{
                marginLeft: "5px",
                border: "none",
                background: "black",
                color: "white",
                borderRadius: "50%",
                width: "20px",
                height: "20px",
                cursor: "pointer",
              }}
            >
              X
            </button>
          </span>
        ))}
      </div>
    </div>
  )
}

export default FavoriteInput