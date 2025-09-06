import { useState, useEffect, useCallback } from 'react'
import './App.css'
import { WORD_PAIRS } from './wordPairs'

// Game states
type GameState = 'COVER' | 'COUNTDOWN' | 'PLAYING' | 'WIN_ROUND' | 'WIN_GAME' | 'FAIL' | 'TIME_UP'

// Game configuration
const GRID_SIZES = [4, 5, 6]
const WIN_ROUND_DELAY = 1000 // 1 second

function App() {
  const [gameState, setGameState] = useState<GameState>('COVER')
  const [currentRound, setCurrentRound] = useState(0)
  const [isPaused, setIsPaused] = useState(true)
  const [countdown, setCountdown] = useState(3)
  const [cards, setCards] = useState<string[]>([])
  const [oddCardIndex, setOddCardIndex] = useState(0)
  const [cardsFlipped, setCardsFlipped] = useState(false)
  const [roundTimeLeft, setRoundTimeLeft] = useState(10)
  const [gameOver, setGameOver] = useState(false)
  const [usedWordPairs, setUsedWordPairs] = useState<Set<number>>(new Set())

  // Timer logic for round time limit only
  useEffect(() => {
    let roundTimer: NodeJS.Timeout
    let startTime: number
    
    if (!isPaused && gameState === 'PLAYING') {
      // Set initial start time and round time
      startTime = performance.now()
      setRoundTimeLeft(10)
      
      const updateRoundTimer = () => {
        const elapsed = (performance.now() - startTime) / 1000
        const timeLeft = Math.max(0, 10 - elapsed)
        setRoundTimeLeft(timeLeft)
        
        if (timeLeft <= 0) {
          // Time's up - show time up screen
          setGameOver(true)
          setIsPaused(true)
          setGameState('TIME_UP')
          return
        }
        
        roundTimer = setTimeout(updateRoundTimer, 50) // Update more frequently for smooth display
      }
      
      roundTimer = setTimeout(updateRoundTimer, 50)
    }
    
    return () => {
      if (roundTimer) {
        clearTimeout(roundTimer)
      }
    }
  }, [isPaused, gameState]) // Remove roundStartTime from dependencies

  // Generate cards for current round
  const generateCards = useCallback((gridSize: number) => {
    // Get available word pairs (not used yet)
    const availableIndices = Array.from({ length: WORD_PAIRS.length }, (_, i) => i)
      .filter(index => !usedWordPairs.has(index))
    
    // If all pairs are used, reset the used pairs set
    if (availableIndices.length === 0) {
      setUsedWordPairs(new Set())
      availableIndices.push(...Array.from({ length: WORD_PAIRS.length }, (_, i) => i))
    }
    
    // Pick a random available word pair
    const randomIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)]
    const wordPair = WORD_PAIRS[randomIndex]
    
    // Mark this pair as used
    setUsedWordPairs(prev => new Set(prev).add(randomIndex))
    
    const normalText = wordPair.normal
    const oddText = wordPair.target
    const totalCards = gridSize * gridSize
    const newOddIndex = Math.floor(Math.random() * totalCards)
    
    const newCards = Array(totalCards).fill(normalText)
    newCards[newOddIndex] = oddText
    
    setCards(newCards)
    setOddCardIndex(newOddIndex)
    setCardsFlipped(false)
    
    // Flip cards after a short delay
    setTimeout(() => {
      setCardsFlipped(true)
    }, 300)
  }, [usedWordPairs])

  // Start game
  const startGame = () => {
    setCurrentRound(0)
    setGameOver(false)
    setUsedWordPairs(new Set()) // Reset used word pairs for new game
    setGameState('COUNTDOWN')
    setCountdown(3)
    
    // Start countdown
    let countdownValue = 3
    const countdownInterval = setInterval(() => {
      countdownValue -= 1
      setCountdown(countdownValue)
      
      if (countdownValue === 0) {
        clearInterval(countdownInterval)
        setIsPaused(false)
        setGameState('PLAYING')
        generateCards(GRID_SIZES[0])
      }
    }, 1000)
  }

  // Handle card click
  const handleCardClick = (index: number) => {
    if (gameState !== 'PLAYING' || gameOver) return
    
    setIsPaused(true)
    
    if (index === oddCardIndex) {
      // Correct card
      if (currentRound === GRID_SIZES.length - 1) {
        // Game completed - just show win screen without time tracking
        setGameState('WIN_GAME')
      } else {
        // Next round
        setGameState('WIN_ROUND')
        setTimeout(() => {
          setCurrentRound(prev => prev + 1)
          setGameState('COUNTDOWN')
          setCountdown(3)
          
          let countdownValue = 3
          const countdownInterval = setInterval(() => {
            countdownValue -= 1
            setCountdown(countdownValue)
            
            if (countdownValue === 0) {
              clearInterval(countdownInterval)
              setIsPaused(false)
              setGameState('PLAYING')
              generateCards(GRID_SIZES[currentRound + 1])
            }
          }, 1000)
        }, WIN_ROUND_DELAY)
      }
    } else {
      // Wrong card
      setGameState('FAIL')
      setTimeout(() => {
        setGameState('COVER')
        setCurrentRound(0)
        setIsPaused(true)
        setGameOver(false)
      }, 1000)
    }
  }

  // Render different screens based on game state
  const renderContent = () => {
    switch (gameState) {
      case 'COVER':
        return (
          <div className="cover-screen">
            <div className="lab-header">
              <h1>IE HEART LAB</h1>
              <div className="year-badge">3027</div>
            </div>
            <div className="game-title">감정 코드 해독 모듈</div>
            <div className="game-description">
              <p>당신의 감정 코드 속 오류가 발생했습니다.</p>
              <p>코드 속에 숨은 잘못된 글자를 찾아내</p>
              <p>감정을 재구성하세요!</p>
            </div>
            <div className="game-info">
              <span className="timer-info">⏱️ 라운드당 10초</span>
            </div>
            <button className="start-button" onClick={startGame}>
              감정 복원 시작
            </button>
          </div>
        )
      
      case 'WIN_GAME':
        return (
          <div className="win-screen">
            <div className="success-icon">🎉</div>
            <h1>감정 복원 완료!</h1>
            <p>모든 감정 코드를 성공적으로 해독했습니다.</p>
            <p>이제 연구원을 찾아 감정 칩을 받으세요!</p>
            <button className="play-again-button" onClick={() => setGameState('COVER')}>
              다시 도전하기
            </button>
          </div>
        )
      
      case 'FAIL':
        return (
          <div className="fail-screen">
            <div className="error-icon">⚠️</div>
            <h1>코드 오류 발생!</h1>
            <p>잘못된 감정 코드를 선택했습니다.</p>
            <p>시스템을 재시작합니다...</p>
          </div>
        )
      
      case 'TIME_UP':
        return (
          <div className="time-up-screen">
            <div className="warning-icon">⏰</div>
            <h1>시간 초과!</h1>
            <p>감정 코드 해독 시간이 부족했습니다.</p>
            <button 
              className="restart-button" 
              onClick={() => {
                setGameState('COVER')
                setCurrentRound(0)
                setIsPaused(true)
                setGameOver(false)
              }}
            >
              처음으로 돌아가기
            </button>
          </div>
        )
      
      case 'COUNTDOWN':
        return (
          <div className="countdown-overlay">
            <div className="countdown-number">{countdown}</div>
          </div>
        )
      
      case 'WIN_ROUND':
        return (
          <div className="win-round-overlay">
            <div className="win-message">감정 코드 해독 성공! ✨</div>
          </div>
        )
      
      case 'PLAYING':
        const gridSize = GRID_SIZES[currentRound]
        const progressPercentage = (roundTimeLeft / 10) * 100
        return (
          <div className="game-screen">
            {/* Round Timer Display */}
            <div className="center-timer">
              <div className="round-time">{roundTimeLeft.toFixed(3)}s</div>
            </div>
            
            {/* Progress Bar */}
            <div className="progress-bar-container">
              <div 
                className="progress-bar" 
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
            
            <div className="game-grid" style={{
              gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
              gridTemplateRows: `repeat(${gridSize}, 1fr)`
            }}>
              {cards.map((text, index) => (
                <button
                  key={index}
                  className={`game-card ${cardsFlipped ? 'flipped' : ''}`}
                  onClick={() => handleCardClick(index)}
                >
                  <div className="card-inner">
                    <div className="card-back">?</div>
                    <div className="card-front">{text}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )
      
      default:
        return null
    }
  }

  return (
    <div className="app">
      {/* Top HUD */}
      {(gameState === 'PLAYING' || gameState === 'WIN_ROUND') && (
        <div className="hud">
          <div className="hud-left">
            <button className="back-button">←</button>
          </div>
          <div className="hud-center">
            <span className="stage-label">레벨 {currentRound + 1}</span>
          </div>
          <div className="hud-right">
            {/* Empty - no timer in HUD anymore */}
          </div>
        </div>
      )}
      
      {/* Main content */}
      <div className="main-content">
        {renderContent()}
      </div>
    </div>
  )
}

export default App
