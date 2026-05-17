import { Editor } from "@tiptap/react";

interface Props {
  editor: Editor | null;
}

function EditorToolbar({ editor }: Props) {
  if (!editor) return null;

  return (
    <div className="write__toolbar">
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={
          editor.isActive("bold") ? "toolbar__btn--active" : "toolbar__btn"
        }
      >
        B
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={
          editor.isActive("italic") ? "toolbar__btn--active" : "toolbar__btn"
        }
      >
        I
      </button>
      <button
        onClick={() => editor?.chain().focus().toggleUnderline().run()}
        className={
          editor?.isActive("underline")
            ? "toolbar__btn--active"
            : "toolbar__btn"
        }
      >
        U
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={
          editor.isActive("heading", { level: 1 })
            ? "toolbar__btn--active"
            : "toolbar__btn"
        }
      >
        H1
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={
          editor.isActive("heading", { level: 2 })
            ? "toolbar__btn--active"
            : "toolbar__btn"
        }
      >
        H2
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={
          editor.isActive("heading", { level: 3 })
            ? "toolbar__btn--active"
            : "toolbar__btn"
        }
      >
        H3
      </button>
      <div className="toolbar__divider" />
      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={
          editor.isActive("bulletList")
            ? "toolbar__btn--active"
            : "toolbar__btn"
        }
      >
        • List
      </button>
      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={
          editor.isActive("orderedList")
            ? "toolbar__btn--active"
            : "toolbar__btn"
        }
      >
        1. List
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={
          editor.isActive("blockquote")
            ? "toolbar__btn--active"
            : "toolbar__btn"
        }
      >
        " Quote
      </button>
      <div className="toolbar__divider" />
      <button
        onClick={() => editor.chain().focus().undo().run()}
        className="toolbar__btn"
      >
        ↩ Undo
      </button>
      <button
        onClick={() => editor.chain().focus().redo().run()}
        className="toolbar__btn"
      >
        ↪ Redo
      </button>
    </div>
  );
}

export default EditorToolbar;
