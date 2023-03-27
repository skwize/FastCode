import {useState, useEffect, useRef, } from 'react'

function Results (props) {
  return (
    <div>{(props.chars / 5) / 0.15}</div>
  )
}


function Cursor (props) {
  return <div id='cursor' style={{
    marginLeft: props.last ? '3px' : '0'
  }}/>
}

function Char(props) {
  return (
    <span>
      {
        props.active && (
          <Cursor />
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

function Words (props) {
    return (
    <div className="words">
        {
            props.words.map(( char, index ) => {
                return <Char key={index}
                    char={ char }
                    active={ index === props.activeCharIndex }
                    correct = { props.correctCharsIndexArray.includes(index) ? true : false }
                    incorrect = { index < props.activeCharIndex ? props.correctCharsIndexArray.includes(index) ? false : true : false }
                />
            })
        }
        {
            props.activeCharIndex === props.words.length && (
                <Cursor last={true}/>
            )
        }
    </div>
    )
}

function Timer (props) {
    const [time, setTime] = useState()

    useEffect(()=>{
      setTime(props.time)
    }, [props.time])

    return(
        <div className="time">{time || 0} sec</div>
    )
}

function App() {

  const chars = () => 'sorry but the code is not available now it will be available soon'.split('')

  const someWords = useRef(chars())

  const [userInput, setUserInput] = useState('')
  const [activeCharIndex, setActiveCharIndex] = useState(0)
  const [correctCharsIndexArray, setCorrectCharsIndexArray] = useState([])
  const [totalKeyPressed, setTotalKeyPressed] = useState(0)
  const [changeTime, setChangeTime] = useState(5)
  const [typing, setTyping] = useState(false)
  const [focus, setFocus] = useState(false)

  useEffect(()=>{
    
    if (typing){
      var timer = setInterval(() => {
        setChangeTime(t => {
          if (t > 0){
            return t - 1
          }else{
            setTyping(false)
            clearInterval(timer)
          }
        })
      }, 1000)
    }
    return () => {
      clearInterval(timer)
    }
  }, [typing])

  useEffect(()=>{
    if(!focus){
        document.getElementById('cursor').style.visibility = 'hidden'
        document.getElementById('focus_warning').style.opacity = 1
    }else{
        document.getElementById('cursor').style.visibility = 'visible'
        document.getElementById('focus_warning').style.opacity = 0
    }
  }, [focus])


  useEffect(()=>{
    if (activeCharIndex >= someWords.current.length){
        setTyping(false)
    }
  }, [activeCharIndex])


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
    setTyping(true)
    if( e.nativeEvent.inputType === 'deleteContentBackward' ){
        clearingInputValue( e )
    }

    else if ( e.nativeEvent.inputType === 'deleteWordBackward' ){
        deleteInputValue( e.target.value )
    }else{
      
      if ( activeCharIndex < someWords.current.length ) {
        setTotalKeyPressed(total => total + 1)
        if( e.nativeEvent.data === someWords.current[activeCharIndex] ){
            setCorrectCharsIndexArray(data => data ? [...data, activeCharIndex] : [activeCharIndex])
        }
        setUserInput( e.target.value )
        setActiveCharIndex(index => index + 1)


          
      }
      else if ( changeTime === 0 ) {
        setTyping(false)
        e.target.value = userInput
      }
      else{
        setTyping(false)
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
		<div className="container">
            <div className="app">
                <Words words={someWords.current} activeCharIndex={activeCharIndex} correctCharsIndexArray={correctCharsIndexArray}/>
                <div id='focus_warning'><span>Click here to start typing</span></div>
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
                <div className="timer">
                    {
                        <Timer started={typing} time={changeTime}/>
                    }
                </div>
            </div>
            {
                activeCharIndex === someWords.current.length ? (
                    <div className='complited' style={{opacity:'1'}}><Results chars={totalKeyPressed}/></div>
                    
                ) : (
                    <div className='complited' style={{opacity:'0'}}>Complited!</div>
                )
            }
        </div>
      </main>
    </>
  );
}

export default App;