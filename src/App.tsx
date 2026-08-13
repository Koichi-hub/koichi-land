import { SnapGridGroup } from '@snapgridjs/react'
import './App.css'
import Panel from './components/Panel/Panel'
import WidgetBoard from './components/WidgetBoard/WidgetBoard'

function App() {
  return (
    <>
      <div className='container'>
        <SnapGridGroup>
          <Panel />
          <WidgetBoard />
        </SnapGridGroup>
      </div>
    </>
  )
}

export default App
