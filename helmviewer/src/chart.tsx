import React, { useEffect, useState, useCallback, FC, useRef } from 'react'
import path from 'path'
import {
  Tree,
  ITreeNode,
  Divider,
  Navbar,
  NavbarGroup,
  NavbarDivider,
  Dialog,
  Classes,
  Spinner,
  Toaster,
  Intent,
  Button,
} from '@blueprintjs/core'
import numeral from 'numeral'
import GitHubButton from 'react-github-btn'
import {
  ChartMetaDirectory,
  ChartMetaItem,
  fetchMeta,
  fetchCode,
  centerStyles,
  HEADER_HEIGHT,
} from './utils'
import { Preview } from './preview'
import { Entry } from './entry'
import { Link, useRouteMatch } from 'react-router-dom'

export const Chart: FC = () => {
  const { params } = useRouteMatch<{ name: string }>()

  let chartName = params.name

  const toastRef = useRef<Toaster>(null)
  const [loadingMeta, setLoadingMeta] = useState(false)
  const [meta, setMeta] = useState<ChartMetaDirectory>()
  const [expandedMap, setExpandedMap] = useState<{ [key: string]: boolean }>({})
  const [selected, setSelected] = useState<string>()
  const [loadingCode, setLoadingCode] = useState(false)
  const [code, setCode] = useState<string>()
  const [ext, setExt] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)

  useEffect(() => {
    const init = async () => {
      try {
        setSelected(undefined)
        setCode(undefined)
        setLoadingMeta(true)
        setMeta(await fetchMeta(chartName))
      } catch (err) {
        console.error(err)
        console.log(toastRef)
        if (toastRef.current) {
          toastRef.current.show({
            message: err.message,
            intent: Intent.DANGER,
          })
        }
      } finally {
        setLoadingMeta(false)
      }
    }
    init()
  }, [chartName])

  const convertMetaToTreeNode = (
    file: ChartMetaItem
  ): ITreeNode<ChartMetaItem> => {
    switch (file.type) {
      case 'directory':
        file.children.sort((a, b) => {
          // Directory first
          if (a.type === 'directory' && b.type === 'file') {
            return -1
          } else if (a.type === 'file' && b.type === 'directory') {
            return 1
          } else {
            // Then sorted by first char
            return (
              path.basename(a.path).charCodeAt(0) -
              path.basename(b.path).charCodeAt(0)
            )
          }
        })
        return {
          id: file.path,
          nodeData: file,
          icon: 'folder-close',
          label: path.basename(file.path),
          childNodes: file.children.map(convertMetaToTreeNode),
          isExpanded: !!expandedMap[file.path],
          isSelected: selected === file.path,
        }
      case 'file':
        return {
          id: file.path,
          nodeData: file,
          icon: 'document',
          label: path.basename(file.path),
          secondaryLabel: numeral(file.size).format(
            file.size < 1024 ? '0b' : '0.00b'
          ),
          isSelected: selected === file.path,
        }
    }
  }

  const handleClick = useCallback(
    async (node: ITreeNode<ChartMetaItem>) => {
      if (!node.nodeData) return

      switch (node.nodeData.type) {
        case 'directory':
          setSelected(node.id as string)
          setExpandedMap((old) => ({ ...old, [node.id]: !old[node.id] }))
          break
        case 'file':
          if (selected === node.id) return

          setSelected(node.id as string)
          try {
            setLoadingCode(true)
            setCode(
              await fetchCode(
                node.id as string
              )
            )
            setExt(path.extname(node.id.toString()).slice(1).toLowerCase())
          } catch (err) {
            console.error(err)
            if (toastRef.current) {
              toastRef.current.show({
                message: err.message,
                intent: Intent.DANGER,
              })
            }
          } finally {
            setLoadingCode(false)
          }
          break
      }
    },
    [chartName, selected]
  )

  if (loadingMeta) {
    return (
      <div style={{ ...centerStyles, height: '100vh' }}>
        <Spinner />
      </div>
    )
  }

  if (!meta) return null

  const files = convertMetaToTreeNode(meta).childNodes
  if (!files) return null

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {/* FIXME: Type */}
      <Toaster ref={toastRef as any} />
      <Navbar style={{ height: HEADER_HEIGHT }}>
        <NavbarGroup style={{ height: HEADER_HEIGHT }}>
          <Link to='/' style={{ textDecoration : 'none', marginRight : '6px' }}>
            <Button icon='home'>
              Home
            </Button>
          </Link>
          <Button
            icon='search'
            onClick={() => {
              setDialogOpen(true)
            }}
          >
            Search
          </Button>

          <Dialog
            isOpen={dialogOpen}
            title="Select Chart"
            icon="info-sign"
            onClose={() => {
              setDialogOpen(false)
            }}
          >
            <div className={Classes.DIALOG_BODY}>
              <Entry
                afterChange={() => {
                  setDialogOpen(false)
                }}
              />
            </div>
          </Dialog>

          <NavbarDivider />
          <a
            href={`https://github.com/helm/charts/tree/master/stable/${chartName}`}
          >
            <strong>{chartName}</strong> Repository
          </a>
        </NavbarGroup>
        <NavbarGroup
          align="right"
          style={{ height: HEADER_HEIGHT, fontSize: 0 }}
        >
          <GitHubButton
            href="https://github.com/kyoungsik-dev/helm-chart-viewer"
            aria-label="Star helm-chart-viewer on GitHub"
            data-icon="octicon-star"
            data-show-count
            data-size="large"
          >
            Star
          </GitHubButton>
        </NavbarGroup>
      </Navbar>
      <div
        style={{
          flexGrow: 1,
          display: 'flex',
          height: `calc(100vh - ${HEADER_HEIGHT}px)`,
        }}
      >
        <div
          style={{
            flexBasis: 300,
            flexShrink: 0,
            overflow: 'auto',
            paddingTop: 5,
          }}
        >
          <Tree
            contents={files}
            onNodeClick={handleClick}
            onNodeExpand={handleClick}
            onNodeCollapse={handleClick}
          />
        </div>
        <Divider />
        <div style={{ flexGrow: 1, overflow: 'auto' }}>
          {loadingCode ? (
            <div style={{ ...centerStyles, height: '100%' }}>
              <Spinner />
            </div>
          ) : (
            <Preview code={code} ext={ext} />
          )}
        </div>
      </div>
    </div>
  )
}
