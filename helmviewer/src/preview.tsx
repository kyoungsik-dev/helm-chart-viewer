import React, { FC } from 'react'
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter'
import * as styles from 'react-syntax-highlighter/dist/esm/styles/hljs'
import * as languages from 'react-syntax-highlighter/dist/esm/languages/hljs'
import { Icon, Classes } from '@blueprintjs/core'
import { centerStyles, HEADER_HEIGHT } from './utils'

SyntaxHighlighter.registerLanguage('yaml', languages.yaml)
SyntaxHighlighter.registerLanguage('js', languages.javascript)
SyntaxHighlighter.registerLanguage('css', languages.css)
SyntaxHighlighter.registerLanguage('scss', languages.scss)
SyntaxHighlighter.registerLanguage('ts', languages.typescript)
SyntaxHighlighter.registerLanguage('json', languages.json)
SyntaxHighlighter.registerLanguage('md', languages.markdown)
SyntaxHighlighter.registerLanguage('txt', languages.plaintext)

export const Preview: FC<{ code?: string; ext: string }> = ({ code, ext }) => {
  if (code == null) {
    return (
      <div
        style={{ ...centerStyles, height: '100%' }}
        className={Classes.TEXT_LARGE}
      >
        <Icon icon="arrow-left" style={{ paddingRight: 10 }} />
        Select a file to view
      </div>
    )
  }

  const language = ext === '' ? 'txt' : ext
  return (
    <SyntaxHighlighter
      language={language}
      showLineNumbers
      style={styles.github}
      lineProps={{
        style: {
          float: 'left',
          paddingRight: 10,
          userSelect: 'none',
          color: 'rgba(27,31,35,.3)',
        },
      }}
      customStyle={{
        marginTop: 5,
        marginBottom: 5,
        maxHeight: `calc(100vh - ${HEADER_HEIGHT + 10}px)`,
      }}
    >
      {code}
    </SyntaxHighlighter>
  )
}
