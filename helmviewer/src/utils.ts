import { CSSProperties } from 'react'

export interface ChartMetaFile {
  path: string
  name: string
  type: 'file'
  size: number
}

export interface ChartMetaDirectory {
  path: string
  name: string
  type: 'directory'
  size: number
  children: ChartMetaItem[]
}

export type ChartMetaItem = ChartMetaFile | ChartMetaDirectory

const API_URL = '/chart'

export const fetchList = async () => {
  const res = await fetch(`${API_URL}/list`)
  return res.json()
}

export const fetchMeta = async (chartName: string) => {
  const res = await fetch(`${API_URL}/tree/${chartName}`)
  const json = await res.json()
  return json as ChartMetaDirectory
}

export const fetchCode = async (path: string) => {
  // await new Promise(r => setTimeout(r, 4000)) // For testing
  path = path.split('/').slice(2).join('/')
  const res = await fetch(`${API_URL}/file/${path}`)
  return res.text()
}

export const centerStyles: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}

export const HEADER_HEIGHT = 40
