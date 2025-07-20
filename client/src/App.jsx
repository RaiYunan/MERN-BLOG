import { useState } from 'react'
import { Button } from './components/ui/button'


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div className='w-full min-h-screen bg-white text-black text-xl font-bold flex justify-center items-center gap-2'>
        BlogMe
        <Button className="bg-green-700 hover:bg-green-900 duration-700 text-xl">
        Click Me!
      </Button>
      </div>
      
    </>
  )
}

export default App
