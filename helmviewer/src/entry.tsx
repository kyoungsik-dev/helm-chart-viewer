import React, { useState, FC, useRef, useEffect } from 'react'
import { Alert, InputGroup, Button, Classes } from '@blueprintjs/core'
import { Link, useHistory } from 'react-router-dom'
import { fetchList } from './utils'

const examples = ['grafana', 'elasticsearch', 'nfs-client-provisioner']

export const Entry: FC<{ afterChange?: Function }> = ({ afterChange }) => {
  const history = useHistory()
  const [name, setName] = useState<string>('')
  const [list, setList] = useState<Array<string>>([])
  const [isOpenError, setIsOpenError] = useState<boolean>(false)
  const inputRef = useRef<HTMLInputElement>()

  useEffect(() => {
    const init = async () => {
      // console.log(inputRef.current)
      inputRef.current && inputRef.current.focus()

      try {
        setList(await fetchList())
        console.log(list)
      } catch (err) {
        console.error(err)
      }
    }
    init()
  }, [])

  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          if (list.indexOf(name) !== -1) {
            afterChange && afterChange()
            history.push(`/${name}`)
          } else {
            setIsOpenError(true);
          }
        }}
      >
        <Alert
            confirmButtonText="Okay"
            isOpen={isOpenError}
            onClose={() => {setIsOpenError(false)}}
        >
          <p>
              Chart Does Not Exist.
          </p>
        </Alert>
        <InputGroup
          inputRef={inputRef as any}
          large
          placeholder="Chart Name"
          leftIcon="search"
          rightElement={<Button icon="arrow-right" minimal type="submit" />}
          value={name}
          onChange={(e: any) => {
            setName(e.target.value)
          }}
          style={{ minWidth: 400 }}
        />
      </form>
      <div style={{ paddingTop: 10 }} className={Classes.TEXT_LARGE}>
        <span>e.g.</span>
        {examples.map((name) => (
          <Link
            to={name}
            key={name}
            style={{ paddingLeft: 20 }}
            onClick={() => {
              afterChange && afterChange()
            }}
          >
            {name}
          </Link>
        ))}
      </div>
    </>
  )
}
