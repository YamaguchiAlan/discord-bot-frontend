import { Dispatch, SetStateAction, FC } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'

interface Props {
    placeholder: string,
    onChange: Dispatch<SetStateAction<string>>
}

const SearchBar: FC<Props> = ({ placeholder, onChange }) =>
  (
    <form className="search" id="search-bar">
        <button className="icon" type='button'><FontAwesomeIcon icon={faSearch}/></button>
        <input placeholder={placeholder} spellCheck="false" type="search" onChange={(e) => onChange(e.target.value)}/>
    </form>
  )

export default SearchBar
