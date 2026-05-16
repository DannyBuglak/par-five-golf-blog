import "./WritePage.css";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

function WritePage() {
  const editor = useEditor({
    extensions: [StarterKit],
    content: "<p>Start writing your post...</p>",
  });

  return (
    <main className="write">
      <div className="write__container">
        <div className="write__header">
          <input
            className="write__title"
            type="text"
            placeholder="Post title..."
          />
        </div>

        <div className="write__toolbar">
          <button
            onClick={() => editor?.chain().focus().toggleBold().run()}
            className={
              editor?.isActive("bold") ? "toolbar__btn--active" : "toolbar__btn"
            }
          >
            B
          </button>
          <button
            onClick={() => editor?.chain().focus().toggleItalic().run()}
            className={
              editor?.isActive("italic")
                ? "toolbar__btn--active"
                : "toolbar__btn"
            }
          >
            I
          </button>
          <button
            onClick={() =>
              editor?.chain().focus().toggleHeading({ level: 1 }).run()
            }
            className={
              editor?.isActive("heading", { level: 1 })
                ? "toolbar__btn--active"
                : "toolbar__btn"
            }
          >
            H1
          </button>
          <button
            onClick={() =>
              editor?.chain().focus().toggleHeading({ level: 2 }).run()
            }
            className={
              editor?.isActive("heading", { level: 2 })
                ? "toolbar__btn--active"
                : "toolbar__btn"
            }
          >
            H2
          </button>
          <button
            onClick={() =>
              editor?.chain().focus().toggleHeading({ level: 3 }).run()
            }
            className={
              editor?.isActive("heading", { level: 3 })
                ? "toolbar__btn--active"
                : "toolbar__btn"
            }
          >
            H3
          </button>
          <div className="toolbar__divider" />
          <button
            onClick={() => editor?.chain().focus().toggleBulletList().run()}
            className={
              editor?.isActive("bulletList")
                ? "toolbar__btn--active"
                : "toolbar__btn"
            }
          >
            • List
          </button>
          <button
            onClick={() => editor?.chain().focus().toggleOrderedList().run()}
            className={
              editor?.isActive("orderedList")
                ? "toolbar__btn--active"
                : "toolbar__btn"
            }
          >
            1. List
          </button>
          <button
            onClick={() => editor?.chain().focus().toggleBlockquote().run()}
            className={
              editor?.isActive("blockquote")
                ? "toolbar__btn--active"
                : "toolbar__btn"
            }
          >
            " Quote
          </button>
          <div className="toolbar__divider" />
          <button
            onClick={() => editor?.chain().focus().undo().run()}
            className="toolbar__btn"
          >
            ↩ Undo
          </button>
          <button
            onClick={() => editor?.chain().focus().redo().run()}
            className="toolbar__btn"
          >
            ↪ Redo
          </button>
        </div>

        <EditorContent editor={editor} className="write__editor" />

        <div className="write__footer">
          <button className="write__draft">Save Draft</button>
          <button className="write__publish">Publish</button>
        </div>
      </div>
    </main>
  );
}

export default WritePage;
