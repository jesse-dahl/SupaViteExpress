import React from 'react'
import reactLogo from '../assets/react.svg'
import viteLogo from '/vite.svg'
import { supabaseClient } from '@supaviteexpress/supabase-client'

const Home: React.FC = () => {
  const [count, setCount] = React.useState(0)

  return (
    <>
      <div>
        <a href="https://vitejs.dev" className='block !h-[320px]' target="_blank">
          <img src={viteLogo} className="block !h-[320px]" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
      <button onClick={() => supabaseClient.auth.signOut()}>Sign out</button>
    </>
  )
}

export default Home;
