import { useState, FC, Dispatch, SetStateAction } from 'react'
import { ChromePicker } from 'react-color'

interface Props {
    value: string,
    setValue: Dispatch<SetStateAction<string>>
}

const ColorPicker: FC<Props> = ({ value, setValue }) => {
  const [visible, setVisible] = useState<boolean>(false)

  return (
        <div className='color-picker'>
            {
            visible
              ? <div className="mobile">
                    <div className='popover'>
                        <div className='cover' onClick={() => setVisible(false)}/>
                        <ChromePicker
                            color={value}
                            onChange={({ hex }) => setValue(hex)}
                        />
                    </div>
                </div>
              : null
            }
            <div className="container">
                <span>{value.toUpperCase()}</span>
                <div className="color">
                        {
                    visible
                      ? <div className="desktop">
                            <div className='popover'>
                                <div className='cover' onClick={() => setVisible(false)}/>
                                <ChromePicker
                                    color={value}
                                    onChange={({ hex }) => setValue(hex)}
                                />
                            </div>
                        </div>
                      : null
                    }

                    <div
                        className="inner" style={{
                          background: value
                        }}
                        onClick={() => setVisible(!visible)}
                    ></div>
                </div>
            </div>
        </div>
  )
}

export default ColorPicker
