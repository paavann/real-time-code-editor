import { useEffect, useRef } from "react"
import { Editor, type OnMount } from "@monaco-editor/react"
import { useAppDispatch, useAppSelector } from "../app/hooks"
import { setCode, setSuggestion, clearSuggestion } from "../features/editor/editorSlice"
import { fetchAutoComplete } from "../features/editor/autoCompleteApi"
import { connectWs } from "../utils/ws"




export default function CodeEditor({ roomId }: { roomId: string }) {
    const dispatch = useAppDispatch()

    const code = useAppSelector((state) => state.editor.code)
    const suggestion = useAppSelector((state) => state.editor.suggestion)

    const wsRef = useRef<WebSocket | null>(null)
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
    const editorRef = useRef<any>(null)
    const monacoRef = useRef<any>(null)
    const decorationRef = useRef<string[]>([])
    const suggestionRef = useRef<string | null>(suggestion)

    const handleMount: OnMount = (editor, monaco) => {
        editorRef.current = editor
        monacoRef.current = monaco

        if(!monaco?.KeyCode?.Tab) {
            console.warn("monaco not fully ready, skipping tab bind.")
            return
        }

        editor.addCommand(monaco.KeyCode.Tab, () => {
            const currentSuggestion = suggestionRef.current
            if(!currentSuggestion) return

            const currentCode = editor.getValue()
            const newCode = currentCode + currentSuggestion

            editor.setValue(newCode)
            dispatch(setCode(newCode))
            dispatch(clearSuggestion())

            if(wsRef.current?.readyState === WebSocket.OPEN) {
                wsRef.current.send(
                    JSON.stringify({ type: "CODE_UPDATE", code: newCode })
                )
            }
        })
    }

    const handleChange = (value: string | undefined) => {
        const newCode = value ?? ""
        dispatch(setCode(newCode))
        if(wsRef.current?.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify({ type: "CODE_UPDATE", code: newCode }))
        }

        if(debounceRef.current) clearTimeout(debounceRef.current)
        debounceRef.current = setTimeout(async () => {
            const suggestion = await fetchAutoComplete(newCode)
            dispatch(setSuggestion(suggestion))
        }, 600)
    }

    useEffect(() => {
        const ws = connectWs(roomId)
        wsRef.current = ws

        ws.onopen = () => console.log("ws connected: ", roomId)
        ws.onclose = () => console.log("ws disconnected")
        ws.onerror = (err) => console.error("ws error: ", err)

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data)
            if(data.type === "CODE_UPDATE") {
                dispatch(setCode(data.code))
            }
        }

        return () => {
            ws.close()
            wsRef.current = null
        }
    }, [roomId])

    useEffect(() => {
        suggestionRef.current = suggestion

        if(!editorRef.current || !monacoRef.current) return
        const editor = editorRef.current
        const monaco = monacoRef.current

        decorationRef.current = editor.deltaDecorations(decorationRef.current, [])

        if(!suggestion || suggestion.trim()==="") return

        const lastLine = editor.getModel().getLineCount()
        const lastColumn = editor.getModel().getLineMaxColumn(lastLine)

        decorationRef.current = editor.deltaDecorations(
            decorationRef.current,
            [
                {
                    range: new monaco.Range(lastLine, lastColumn, lastLine, lastColumn),
                    options: {
                        after: {
                            contentText: suggestion,
                            color: "#6b7280",
                            fontStyle: "italic",
                            margin: "5px",
                        }
                    }
                }
            ]
        )
    }, [suggestion])

    return (
        <Editor
            height="80vh"
            defaultLanguage="python"
            theme="vs-dark"
            value={code}
            onMount={handleMount}
            onChange={handleChange}
            options={{
                minimap: { enabled: false },
                fontSize: 14,
            }}
        />
    )
}