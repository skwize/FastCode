import {useState, useEffect, useRef} from 'react'

function Char(props) {
  return (
    <span>
      {
        props.active && (
          <div id='cursor' />
        )
      }
      <span className='char' style={{
        color: props.correct ? props.active ? 'inherit' : '#fff' : props.incorrect ? 'red' : 'inherit',
        fontWeight: props.active ? 'bolder' : props.correct ? 'bold' : 'normal',
        marginLeft: props.active ? '2px' : '0',
      }}>
        {props.char}
      </span>
    </span>
  )

}

function App() {

  const words = () => 'github react someword \nother rain lofi music that \ngreat feature hololive gawr gura ina neuro twitch bugs controller model views newspaper'.split('')

  const someWords = useRef(words())

  const [userInput, setUserInput] = useState('')
  const [activeCharIndex, setActiveCharIndex] = useState(0)
  const [correctCharsIndexArray, setCorrectCharsIndexArray] = useState([])
  const [focus, setFocus] = useState(false)

  useEffect(()=>{
    if(!focus){
      document.getElementById('cursor').style.display = 'none'
      document.getElementById('focus_warning').style.opacity = 1
    }else{
      document.getElementById('cursor').style.display = 'inline-block'
      document.getElementById('focus_warning').style.opacity = 0
    }

  }, [focus])


  function clearingInputValue ( e ) {
    if ( activeCharIndex >= 0 ){
      setActiveCharIndex(index => index - 1)
    }
    if( correctCharsIndexArray.includes( activeCharIndex ) ){
      setCorrectCharsIndexArray(chars => chars.filter( char => char !== chars[chars.length - 1] ))
    }
    setUserInput( e.target.value )
  }

  function deleteInputValue ( value ){
    setCorrectCharsIndexArray([])
    setActiveCharIndex(0)
    setUserInput( value )
  }
  
  function processInput ( e ) {
    if( e.nativeEvent.inputType === 'deleteContentBackward' ){
      clearingInputValue( e )
    }
    else if ( e.nativeEvent.inputType === 'deleteWordBackward' ){
      deleteInputValue( e.target.value )
    }
    else{
      if ( activeCharIndex !== someWords.current.length ){
        if( e.nativeEvent.data === someWords.current[activeCharIndex] ){
          setCorrectCharsIndexArray(data => data ? [...data, activeCharIndex] : [activeCharIndex])
        }
          setUserInput( e.target.value )
          setActiveCharIndex(index => index + 1)
      }else{
        e.target.value = userInput
      }
    }
  }

  return (
    <>
      <header>
        <h1 className='title'>FastCode</h1>
        <span className='subtitle'>Improve your code typing skills</span>
      </header>
      <main>
        <div className="app">
          <div>
            {
              someWords.current.map(( char, index ) => {
                return <Char key={index}
                  char={ char }
                  active={ index === activeCharIndex }
                  correct = { correctCharsIndexArray.includes(index) ? true : false }
                  incorrect = { index < activeCharIndex ? correctCharsIndexArray.includes(index) ? false : true : false }
                />
              })
            }
            <div id='focus_warning'><span>Click here to start typing</span></div>
          </div>
          <input 
            type="text"
            id='input'
            autoFocus={true}
            onBlur={()=>{
              setFocus(false)
            }}
            onFocus={()=>{
              setFocus(true)
            }}
            value={userInput}
            className='userInput'
            onChange={(e) => { processInput(e) }}
          />
        </div>
      </main>
    </>
  );
}

export default App;