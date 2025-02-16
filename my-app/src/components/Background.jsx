import { useEffect, useRef } from 'react'
import backgroundImage from '../Images/Background/PNG/City2/Pale/City2_pale.png'

function Background() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    canvas.width = 600
    canvas.height = 600

    const background = new Image()
    background.src = backgroundImage

    background.onload = () => {
      ctx.drawImage(
        background,
        0, 0,
        canvas.width, canvas.height
      )
    }
  }, [])

  return (
    <div className='background-container'>
    <canvas 
      ref={canvasRef}
      id="canvas1"
      style={{
        width: '1000px',  // Force canvas display size
      }}
    />
    </div>
  )
}

export default Background 