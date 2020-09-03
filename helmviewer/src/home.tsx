import React, { FC } from 'react'
import { Entry } from './entry'
import { H1 } from '@blueprintjs/core'
import { centerStyles } from './utils'

export const Home: FC = () => {
  return (
    <div style={{
      ...centerStyles, 
      height: '100vh', 
      flexDirection: 'column',
      backgroundImage: 'url(/bg.jpg)',
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    }}>
      <H1 style={{ paddingBottom: 20 }}>helm-chart-viewer</H1>
      <Entry />
      <div style={{ height: '30vh' }} />
    </div>
  )
}
