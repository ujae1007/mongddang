import { useState } from "react"

interface FavoriteProps{
  type: "genre" | "place"
  placeholder?: string
  onChange: (selecetedItem: string[]) => void
}

const genreOptions = [
"acoustic", "alternative", "blues", "classical",
"club", "country", "dance", "disco", "edm",
"electronic", "emo","folk", "funk", "garage",
"groove", "heavy-metal", "hip-hop", "house",
"indie", "k-pop", "movies", "new-age", "party",
"pop", "punk", "r-n-b", "reggae", "rock", "soul", "tango",
]
const placeOptions = [
  "인천", "서울", "경기도", "강원도", "세종", "충청남도", "충청북도",
  "대전", "경상북도", "대구", "전라북도", "광주", "전라남도",
  "경상남도", "울산", "부산", "제주"
]

const FavoriteInput = ({type, placeholder, onChange}: FavoriteProps) => {

  const options = type === "genre" ? genreOptions : placeOptions
  const [selectedItems, setSelectedItems ] = useState<string[]>([])

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

  return(
    <div className="SelectOptionWrap">
      <select onChange={handleSelect} value="">
        <option value=""> {placeholder}</option>
        {options.map(option =>(
          <option key={option} value={option}>
            {option}
          </option>)         
        )}
      </select>

    <div className="selectedItemsWrap">
      {selectedItems.map(item => (
        <span key={item} style={{ marginRight: "8px", fontWeight: "bold" }}>
          {item}
        </span>
      ))}

    </div>

    </div>

  )
}

export default FavoriteInput