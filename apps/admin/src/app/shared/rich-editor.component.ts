import { HttpClient } from '@angular/common/http';
import {
  Component, ElementRef, Input, OnChanges, OnDestroy, OnInit,
  Output, EventEmitter, SimpleChanges, ViewChild, inject, signal,
} from '@angular/core';
import { Editor } from '@tiptap/core';
import Image from '@tiptap/extension-image';
import Youtube from '@tiptap/extension-youtube';
import StarterKit from '@tiptap/starter-kit';
import { TiptapEditorDirective } from 'ngx-tiptap';
import { ToastService } from '../services/toast.service';

@Component({
  selector: 'app-rich-editor',
  imports: [TiptapEditorDirective],
  template: `
    <div class="flex flex-wrap items-center gap-1 px-2 py-1.5 border border-base-300 border-b-0 rounded-t-lg bg-base-200">
      <button type="button" class="btn btn-xs btn-ghost font-black"
        [class.btn-active]="isActive('heading', { level: 1 })"
        (click)="toggleHeading(1)" title="제목 1">H1</button>
      <button type="button" class="btn btn-xs btn-ghost font-bold"
        [class.btn-active]="isActive('heading', { level: 2 })"
        (click)="toggleHeading(2)" title="제목 2">H2</button>
      <button type="button" class="btn btn-xs btn-ghost font-semibold"
        [class.btn-active]="isActive('heading', { level: 3 })"
        (click)="toggleHeading(3)" title="제목 3">H3</button>

      <div class="w-px h-4 bg-base-300 mx-1"></div>

      <button type="button" class="btn btn-xs btn-ghost font-bold"
        [class.btn-active]="isActive('bold')"
        (click)="execCommand('toggleBold')" title="굵게 (Ctrl+B)">B</button>
      <button type="button" class="btn btn-xs btn-ghost italic"
        [class.btn-active]="isActive('italic')"
        (click)="execCommand('toggleItalic')" title="기울임 (Ctrl+I)">I</button>

      <div class="w-px h-4 bg-base-300 mx-1"></div>

      <button type="button" class="btn btn-xs btn-ghost"
        [class.btn-active]="isActive('bulletList')"
        (click)="execCommand('toggleBulletList')" title="순서 없는 목록">• 목록</button>
      <button type="button" class="btn btn-xs btn-ghost"
        [class.btn-active]="isActive('orderedList')"
        (click)="execCommand('toggleOrderedList')" title="순서 있는 목록">1. 목록</button>

      <div class="w-px h-4 bg-base-300 mx-1"></div>

      <button type="button" class="btn btn-xs btn-ghost gap-1"
        [disabled]="uploading()"
        (click)="openImagePicker()" title="이미지 삽입">
        <svg xmlns="http://www.w3.org/2000/svg" class="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
        </svg>
        {{ uploading() ? '업로드 중...' : '이미지' }}
      </button>
      <button type="button" class="btn btn-xs btn-ghost gap-1"
        (click)="insertYoutubeVideo()" title="동영상 삽입">
        <svg xmlns="http://www.w3.org/2000/svg" class="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/>
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
        동영상
      </button>

      <input #imageInput type="file" accept="image/*" class="hidden" (change)="onImageSelect($event)" />
    </div>

    <div
      tiptap
      [editor]="editor"
      class="border border-base-300 rounded-b-lg min-h-64 p-3 focus-within:outline-2 focus-within:outline-offset-0 focus-within:outline-base-content/20 prose prose-sm max-w-none"
    ></div>
  `,
})
export class RichEditorComponent implements OnInit, OnChanges, OnDestroy {
  @ViewChild('imageInput') imageInputRef!: ElementRef<HTMLInputElement>;

  @Input() content = '';
  @Output() contentChange = new EventEmitter<string>();
  @Input() imageUploadUrl = '/api/upload/image';

  private http = inject(HttpClient);
  private toast = inject(ToastService);

  uploading = signal(false);

  private emitting = false;

  editor = new Editor({
    extensions: [
      StarterKit,
      Image.configure({ inline: false, allowBase64: false }),
      Youtube.configure({ width: 640, height: 360, nocookie: true }),
    ],
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      this.emitting = true;
      this.contentChange.emit(html);
      this.emitting = false;
    },
  });

  ngOnInit() {
    if (this.content) {
      this.editor.commands.setContent(this.content);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['content'] && !changes['content'].firstChange && !this.emitting) {
      const incoming = changes['content'].currentValue as string;
      if (incoming !== this.editor.getHTML()) {
        this.editor.commands.setContent(incoming || '');
      }
    }
  }

  ngOnDestroy() {
    this.editor.destroy();
  }

  isActive(type: string, attrs?: Record<string, unknown>) {
    return this.editor.isActive(type, attrs);
  }

  execCommand(command: 'toggleBold' | 'toggleItalic' | 'toggleBulletList' | 'toggleOrderedList') {
    this.editor.chain().focus()[command]().run();
  }

  toggleHeading(level: 1 | 2 | 3) {
    this.editor.chain().focus().toggleHeading({ level }).run();
  }

  insertYoutubeVideo() {
    const url = prompt('YouTube 또는 Vimeo URL을 입력하세요');
    if (!url) return;
    this.editor.chain().focus().setYoutubeVideo({ src: url }).run();
  }

  openImagePicker() {
    this.imageInputRef.nativeElement.click();
  }

  onImageSelect(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    this.uploading.set(true);
    const formData = new FormData();
    formData.append('file', file);
    this.http.post<{ url: string }>(this.imageUploadUrl, formData).subscribe({
      next: ({ url }) => {
        this.editor.chain().focus().setImage({ src: url }).run();
        this.uploading.set(false);
      },
      error: () => {
        this.toast.error('이미지 업로드에 실패했습니다.');
        this.uploading.set(false);
      },
    });
    input.value = '';
  }

  getHTML() {
    return this.editor.getHTML();
  }

  getText() {
    return this.editor.getText();
  }
}
