"use client"

import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Underline from "@tiptap/extension-underline"
import TextAlign from "@tiptap/extension-text-align"
import ListItem from "@tiptap/extension-list-item"
import BulletList from "@tiptap/extension-bullet-list"
import OrderedList from "@tiptap/extension-ordered-list"
import {
    Bold,
    Italic,
    UnderlineIcon,
    List,
    ListOrdered,
    Undo,
    Redo,
    AlignLeft,
    AlignCenter,
    AlignRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

interface TiptapEditorProps {
    content: string
    onChange: (content: string) => void
}

export function TiptapEditor({ content, onChange }: TiptapEditorProps) {
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: {
                    levels: [1, 2, 3],
                },
                bulletList: false,
                orderedList: false,
                listItem: false,
            }),
            Underline,
            TextAlign.configure({
                types: ["heading", "paragraph"],
            }),
            ListItem,
            BulletList,
            OrderedList,
        ],
        content,
        immediatelyRender: false,
        editorProps: {
            attributes: {
                class:
                    "prose prose-sm dark:prose-invert max-w-none focus:outline-none min-h-[200px] p-4 rounded-md border border-input bg-background [&_ol]:list-decimal [&_ol]:ml-6 [&_ul]:list-disc [&_ul]:ml-6 [&_li]:mt-2",
            },
        },
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML())
        },
    })

    if (!editor) {
        return null
    }

    return (
        <div className="border rounded-lg bg-background">
            <div className="flex flex-wrap items-center gap-1 p-2 border-b">
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    className={editor.isActive("bold") ? "bg-accent" : ""}
                >
                    <Bold className="h-4 w-4" />
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    className={editor.isActive("italic") ? "bg-accent" : ""}
                >
                    <Italic className="h-4 w-4" />
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleUnderline().run()}
                    className={editor.isActive("underline") ? "bg-accent" : ""}
                >
                    <UnderlineIcon className="h-4 w-4" />
                </Button>

                <Separator orientation="vertical" className="h-6 mx-1" />

                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    className={editor.isActive("bulletList") ? "bg-accent" : ""}
                >
                    <List className="h-4 w-4" />
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    className={editor.isActive("orderedList") ? "bg-accent" : ""}
                >
                    <ListOrdered className="h-4 w-4" />
                </Button>

                <Separator orientation="vertical" className="h-6 mx-1" />

                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().setTextAlign("left").run()}
                    className={editor.isActive({ textAlign: "left" }) ? "bg-accent" : ""}
                >
                    <AlignLeft className="h-4 w-4" />
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().setTextAlign("center").run()}
                    className={editor.isActive({ textAlign: "center" }) ? "bg-accent" : ""}
                >
                    <AlignCenter className="h-4 w-4" />
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().setTextAlign("right").run()}
                    className={editor.isActive({ textAlign: "right" }) ? "bg-accent" : ""}
                >
                    <AlignRight className="h-4 w-4" />
                </Button>

                <Separator orientation="vertical" className="h-6 mx-1" />

                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().undo().run()}
                    disabled={!editor.can().undo()}
                >
                    <Undo className="h-4 w-4" />
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().redo().run()}
                    disabled={!editor.can().redo()}
                >
                    <Redo className="h-4 w-4" />
                </Button>
            </div>

            <EditorContent editor={editor} />
        </div>
    )
}
