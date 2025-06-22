import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { routes } from './assets/routes/routes.tsx'
import "./assets/styles/global.css"
import { Context } from './assets/context/Context.tsx'

createRoot(document.getElementById('root')!).render(
    <div className='w-full h-[100vh] bg-background'>
      <Context>
        <RouterProvider router={routes}/>
      </Context>
    </div>
)