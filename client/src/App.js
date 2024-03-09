import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Lobby from './screens/Lobby'
import Room from './screens/Room'

const App = () => {




  return (
    <Routes>
      <Route path='/' element={<Lobby/>}/>
      <Route path='/room' element={<Room/>}/>
    </Routes>
  )
}

export default App