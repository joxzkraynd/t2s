"use client"

import { useState, useEffect, useRef } from "react"
import { AUDIO_TAGS } from "@/data/audio-tags"

interface Props {
  textareaRef?: React.RefObject<HTMLTextAreaElement | null>
  textareaId?: string
}

function resolveTextarea(ref?: React.RefObject<HTMLTextAreaElement | null> | null, id?: string): HTMLTextAreaElement | null {
  if (ref?.current) return ref.current
  if (id) return document.getElementById(id) as HTMLTextAreaElement | null
  return null
}

function getCursorPosition(textarea: HTMLTextAreaElement, charIndex: number): { top: number; left: number; height: number } {
  const mirror = document.createElement("div")
  const style = window.getComputedStyle(textarea)

  mirror.style.cssText = [
    "position:fixed",
    "top:0",
    "left:0",
    "pointer-events:none",
    `font-family:${style.fontFamily}`,
    `font-size:${style.fontSize}`,
    `font-weight:${style.fontWeight}`,
    `font-style:${style.fontStyle}`,
    `font-variant:${style.fontVariant}`,
    `line-height:${style.lineHeight}`,
    `letter-spacing:${style.letterSpacing}`,
    `white-space:pre-wrap`,
    `overflow-wrap:break-word`,
    `width:${textarea.clientWidth}px`,
    `padding-top:${style.paddingTop}`,
    `padding-right:${style.paddingRight}`,
    `padding-bottom:${style.paddingBottom}`,
    `padding-left:${style.paddingLeft}`,
    `border:${style.border}`,
    `box-sizing:border-box`,
  ].join(";")

  const before = textarea.value.slice(0, charIndex)
  mirror.textContent = before
  const marker = document.createElement("span")
  marker.textContent = "w"
  mirror.appendChild(marker)
  document.body.appendChild(mirror)

  const markerRect = marker.getBoundingClientRect()
  const textareaRect = textarea.getBoundingClientRect()
  document.body.removeChild(mirror)

  return {
    top: textareaRect.top + markerRect.top - textarea.scrollTop,
    left: textareaRect.left + markerRect.left - textarea.scrollLeft,
    height: markerRect.height,
  }
}

export function AudioTagAutocomplete({ textareaRef, textareaId }: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState("")
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [position, setPosition] = useState({ top: 0, left: 0 })
  const containerRef = useRef<HTMLDivElement>(null)
  const cleanupRef = useRef<(() => void) | null>(null)

  const filtered = AUDIO_TAGS.filter(t => t.toLowerCase().includes(search.toLowerCase()))

  function getTextarea() {
    return resolveTextarea(textareaRef, textareaId)
  }

  function insertTag(tag: string) {
    const textarea = getTextarea()
    if (!textarea) return

    const cursor = textarea.selectionStart
    const text = textarea.value
    const beforeCursor = text.slice(0, cursor)
    const afterCursor = text.slice(cursor)

    const lastOpen = beforeCursor.lastIndexOf("[")
    const before = beforeCursor.slice(0, lastOpen)
    const insertion = `[${tag}] `

    textarea.focus()
    textarea.value = before + insertion + afterCursor
    const newCursor = before.length + insertion.length
    textarea.selectionStart = textarea.selectionEnd = newCursor
    textarea.dispatchEvent(new Event("input", { bubbles: true }))

    setIsOpen(false)
  }

  function handleInput() {
    const textarea = getTextarea()
    if (!textarea) return

    const cursor = textarea.selectionStart
    const beforeCursor = textarea.value.slice(0, cursor)

    const lastOpen = beforeCursor.lastIndexOf("[")
    const lastClose = beforeCursor.lastIndexOf("]")

    if (lastOpen === -1 || lastClose > lastOpen) {
      setIsOpen(false)
      return
    }

    const raw = beforeCursor.slice(lastOpen + 1)
    if (raw.includes("\n") || raw.length > 30) {
      setIsOpen(false)
      return
    }

    setSearch(raw)
    setSelectedIndex(0)
    setIsOpen(true)

    const pos = getCursorPosition(textarea, lastOpen)
    setPosition({ top: pos.top + pos.height + 4, left: pos.left })
  }

  useEffect(() => {
    function tryAttach() {
      const textarea = getTextarea()
      if (!textarea) return false

      const onInput = () => handleInput()
      const onKeyDown = (e: KeyboardEvent) => {
        if (!isOpenRef.current) return
        const items = AUDIO_TAGS.filter(t => t.toLowerCase().includes(searchRef.current.toLowerCase()))

        if (e.key === "ArrowDown") {
          e.preventDefault()
          setSelectedIndex(i => Math.min(i + 1, items.length - 1))
        } else if (e.key === "ArrowUp") {
          e.preventDefault()
          setSelectedIndex(i => Math.max(i - 1, 0))
        } else if (e.key === "Enter" || e.key === "Tab") {
          if (items[selectedIndexRef.current]) {
            e.preventDefault()
            insertTag(items[selectedIndexRef.current])
          }
        } else if (e.key === "Escape") {
          setIsOpen(false)
        }
      }

      textarea.addEventListener("input", onInput)
      textarea.addEventListener("keydown", onKeyDown)

      cleanupRef.current = () => {
        textarea.removeEventListener("input", onInput)
        textarea.removeEventListener("keydown", onKeyDown)
      }

      return true
    }

    if (tryAttach()) return

    const id = requestAnimationFrame(() => tryAttach())

    return () => {
      cancelAnimationFrame(id)
      cleanupRef.current?.()
    }
  }, [textareaRef, textareaId])

  const isOpenRef = useRef(isOpen)
  const searchRef = useRef(search)
  const selectedIndexRef = useRef(selectedIndex)
  isOpenRef.current = isOpen
  searchRef.current = search
  selectedIndexRef.current = selectedIndex

  useEffect(() => {
    if (!isOpen) return
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [isOpen])

  if (!isOpen || filtered.length === 0) return null

  return (
    <div
      ref={containerRef}
      className="fixed z-50 max-h-48 min-w-[180px] overflow-y-auto rounded-lg border bg-popover p-1 shadow-md"
      style={{ top: position.top, left: position.left, scrollbarWidth: "none" }}
    >
      {filtered.map((tag, i) => (
        <button
          key={tag}
          className={`flex w-full items-center rounded-md px-3 py-1.5 text-sm text-left ${
            i === selectedIndex
              ? "bg-accent text-accent-foreground"
              : "text-popover-foreground hover:bg-accent/50"
          }`}
          onMouseDown={(e) => { e.preventDefault(); insertTag(tag) }}
          onMouseEnter={() => setSelectedIndex(i)}
        >
          [{tag}]
        </button>
      ))}
    </div>
  )
}
