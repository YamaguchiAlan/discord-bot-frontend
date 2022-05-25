import { Dispatch, SetStateAction, FC } from 'react'

interface Props {
    placeholder: string,
    onChange: Dispatch<SetStateAction<string>>
}

const SearchBar: FC<Props> = ({ placeholder, onChange }) =>
  (
    <form className="search" id="search-bar">
        <button className="icon" type='button'><i className="fas fa-search"></i></button>
        <input placeholder={placeholder} spellCheck="false" type="search" onChange={(e) => onChange(e.target.value)}/>
    </form>
  )

export default SearchBar
