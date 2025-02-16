import { useEffect, useState, useRef } from 'react'
import attackSprite from '../Images/Wild Zombie/Attack_1.png'
import walkSprite from '../Images/Wild Zombie/Walk.png'

function Zombie() {
  const canvasRef = useRef(null)
  const [currentAction, setCurrentAction] = useState('idle')
  const [direction, setDirection] = useState('right')
  const [position, setPosition] = useState(300) // Center position
  const frameRef = useRef(0)
  const animationIdRef = useRef(null)
  const timeoutIdRef = useRef(null)
  const spriteRefs = useRef({
    attack: new Image(),
    walk: new Image()
  })

  useEffect(() => {
    const handleKeyPress = (e) => {
      const key = e.key.toLowerCase()
      if (key === 'x') {
        setCurrentAction('attack')
      } else if (key === 'd') {
        setCurrentAction('walk')
        setDirection('right')
      } else if (key === 'a') {
        setCurrentAction('walk')
        setDirection('left')
      }
    }

    const handleKeyUp = (e) => {
      const key = e.key.toLowerCase()
      if (key === 'x' && currentAction === 'attack') {
        setCurrentAction('idle')
        frameRef.current = 0
      } else if ((key === 'd' || key === 'a') && currentAction === 'walk') {
        setCurrentAction('idle')
        frameRef.current = 0
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    window.addEventListener('keyup', handleKeyUp)
    
    return () => {
      window.removeEventListener('keydown', handleKeyPress)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [currentAction])

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    canvas.width = 96  // Just enough for the zombie
    canvas.height = 96

    spriteRefs.current.attack.src = attackSprite
    spriteRefs.current.walk.src = walkSprite

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      let currentSprite
      let maxFrames
      let animationDelay = 100

      switch(currentAction) {
        case 'attack':
          currentSprite = spriteRefs.current.attack
          maxFrames = 5
          if (frameRef.current === maxFrames - 1) {
            frameRef.current = 0
          }
          break
        case 'walk':
          currentSprite = spriteRefs.current.walk
          maxFrames = 8
          if (Date.now() % 150 < 20) {
            frameRef.current = (frameRef.current + 1) % maxFrames
          }
          break
        default:
          currentSprite = spriteRefs.current.attack
          maxFrames = 1
          frameRef.current = 0
      }

      ctx.save()

      if (direction === 'left') {
        ctx.scale(-1, 1)
        ctx.drawImage(
          currentSprite,
          currentAction === 'idle' ? 0 : frameRef.current * 96, 0,
          96, 96,
          -96, 0,  // Changed to fixed position within canvas
          96, 96
        )
      } else {
        ctx.drawImage(
          currentSprite,
          currentAction === 'idle' ? 0 : frameRef.current * 96, 0,
          96, 96,
          0, 0,    // Changed to fixed position within canvas
          96, 96
        )
      }

      ctx.restore()

      if (currentAction !== 'idle') {
        frameRef.current = (frameRef.current + 1) % maxFrames
      }

      timeoutIdRef.current = setTimeout(() => {
        animationIdRef.current = requestAnimationFrame(animate)
      }, animationDelay)
    }

    animate()

    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current)
      }
      if (timeoutIdRef.current) {
        clearTimeout(timeoutIdRef.current)
      }
    }
  }, [currentAction, direction])

  // Updated useEffect for handling all movements
  useEffect(() => {
    let moveId = null;

    if (currentAction === 'walk') {  // Only move during walk action
      const moveZombie = () => {
        if (direction === 'right') {
          setPosition(prev => Math.min(prev + 0.5, window.innerWidth - 96))
        } else if (direction === 'left') {
          setPosition(prev => Math.max(prev - 0.5, 0))
        }
        moveId = requestAnimationFrame(moveZombie)
      }

      moveId = requestAnimationFrame(moveZombie)
    }

    return () => {
      if (moveId) {
        cancelAnimationFrame(moveId)
      }
    }
  }, [currentAction, direction])

  const zombieStyle = {
    left: `${position}px`,
    transition: 'left 0.01s linear'
  }

  return (
    <div className="zombie-container" style={zombieStyle}>
      <canvas ref={canvasRef} />
    </div>
  )
}

export default Zombie 