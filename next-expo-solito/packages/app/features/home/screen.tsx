import React, { useState } from 'react'
import { useStopwatch } from 'react-timer-hook'
import { YStack, XStack, TextArea, Button, Text, Progress } from '@my/ui'

class Agenda {
  seconds: number
  lines: Line[] | null
  minutes(): string | null {
    var date = new Date(0)
    date.setSeconds(this.seconds)
    let minutes: string | null = null
    try {
      minutes = date.toISOString().substr(11, 8)
    } catch {}
    return minutes
  }
}

class Line {
  seconds: number
  filled: boolean
  text: string
}

function parseLine(text: string): Line {
  const minutesRegex = /[0-9]+m/g
  const secondsRegex = /[0-9]+s/g
  const foundMinutes = text.match(minutesRegex)
  const foundSeconds = text.match(secondsRegex)
  const line = new Line()
  if (foundMinutes && foundMinutes.length > 0) {
    const match = foundMinutes[0]!
    const minutes = parseInt(match.replace('m', ''))
    line.seconds = minutes * 60
    line.text = text.replace(match, '').trim()
    return line
  } else if (foundSeconds && foundSeconds.length > 0) {
    const match = foundSeconds[0]!
    const seconds = parseInt(match.replace('s', ''))
    line.seconds = seconds
    line.text = text.replace(match, '').trim()
    return line
  } else {
    line.seconds = 0
    line.text = text.trim()
    return line
  }
}

function parseAgenda(text: string): Agenda {
  const lines = text
    .trim()
    .split('\n')
    .map((x) => parseLine(x))
  const agenda = new Agenda()
  agenda.lines = lines
  const lineCount = lines.length
  let totalSeconds = 0
  let missingSecondsCount = 0
  lines.forEach((line) => {
    totalSeconds = totalSeconds + line.seconds
    if (line.seconds == 0) {
      missingSecondsCount += 1
    }
  })
  agenda.seconds = totalSeconds
  if (lineCount > 1) {
    const lastLine = lines[lineCount - 1]!
    console.log(lastLine)
    if (lastLine.text.length == 0 && lastLine.seconds >= totalSeconds - lastLine.seconds) {
      agenda.seconds = lastLine.seconds
      const missingSeconds = lastLine.seconds - (totalSeconds - lastLine.seconds)
      const fillerSeconds = missingSeconds / missingSecondsCount
      lines.forEach((line) => {
        if (line.seconds === 0) {
          line.seconds = fillerSeconds
          line.filled = true
        }
      })
      console.log('missing ' + missingSeconds)
      console.log('filler ' + fillerSeconds)
    }
  }
  return agenda
}

export function HomeScreen() {
  const { seconds, minutes, hours, days, isRunning, start, pause, reset } = useStopwatch({
    autoStart: false,
  })
  const rowsInit: Line[] = [new Line(), new Line()]
  const agendaInit: Agenda = new Agenda()
  const [rows, setRows] = useState(rowsInit)
  const [agenda, setAgenda] = useState(agendaInit)
  return rows.map((line, index) => {
    if (index === 0) {
      return (
        <YStack margin={3}>
          <TextArea
            size="$4"
            numberOfLines={6}
            fontSize={20}
            borderWidth={2}
            onChange={(t) => {
              const text = t.target.value
              const latestAgenda = parseAgenda(text)
              setAgenda(latestAgenda)
              setRows(rowsInit.concat(latestAgenda.lines ?? []))
            }}
          />
          <Text fontFamily="$body" fontSize={20}>
            {`${hours}:${minutes}:${seconds}`}
          </Text>
        </YStack>
      )
    } else if (index === 1) {
      return (
        <YStack margin={3}>
          <XStack flex={0} space>
            <Button
              size="$6"
              fontFamily="$heading"
              backgroundColor={isRunning ? 'orange' : 'green'}
              onClick={(_) => (isRunning ? pause() : start())}
            >
              {isRunning ? 'Pause' : 'Start'}
            </Button>
          </XStack>
          <Text fontFamily="$body" fontSize={20}>
            {agenda.minutes()}
          </Text>
        </YStack>
      )
    } else if (line.text) {
      return (
        <YStack borderWidth={2} padding={10} margin={3}>
          {line.seconds > 0 && line.text && (
            <YStack>
              <Text fontFamily="$body" fontSize={20}>
                {line.text}
              </Text>
              <XStack space>
                <Progress flex={1} value={100}>
                  <Progress.Indicator animation="bouncy" />
                </Progress>
                <Text
                  fontFamily="$body"
                  fontSize={20}
                  backgroundColor={line.filled ? 'cyan' : 'white'}
                >
                  {`${line.seconds.toFixed(0)}s`}
                </Text>
              </XStack>
            </YStack>
          )}
          {line.seconds == 0 && (
            <Text fontFamily="$body" fontSize={20}>
              {line.text}
            </Text>
          )}
        </YStack>
      )
    }
  })
}
