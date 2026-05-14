import { Component, ElementRef, OnDestroy, OnInit, ViewChild, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Editor } from '@tiptap/core';
import Image from '@tiptap/extension-image';
import Youtube from '@tiptap/extension-youtube';
import StarterKit from '@tiptap/starter-kit';
import { TiptapEditorDirective } from 'ngx-tiptap';
import { GalleryApiService, GalleryDTO } from '../../../services/gallery-api.service';
import { ToastService } from '../../../services/toast.service';

const TITLE_MAX = 100;

@Component({
  selector: 'app-gallery-form',
  imports: [FormsModule, TiptapEditorDirective],
  templateUrl: './gallery-form.component.html',
})
export class GalleryFormComponent implements OnInit, OnDestroy {
  @ViewChild('editorImageInput') editorImageInputRef!: ElementRef<HTMLInputElement>;

  private galleryApi = inject(GalleryApiService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private toast = inject(ToastService);

  readonly TITLE_MAX = TITLE_MAX;

  isEditMode = false;
  private galleryId?: number;

  title = '';
  content = '';
  eventName = '';

  uploading = signal(false);
  loading = signal(false);
  errorMsg = signal('');
  eventNameSuggestions = signal<string[]>([]);

  editor = new Editor({
    extensions: [
      StarterKit,
      Image.configure({ inline: false, allowBase64: false }),
      Youtube.configure({ width: 640, height: 360, nocookie: true }),
    ],
    onUpdate: ({ editor }) => {
      this.content = editor.getHTML();
    },
  });

  ngOnInit() {
    this.galleryApi.getEventNames().subscribe({
      next: (names) => this.eventNameSuggestions.set(names),
    });

    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.isEditMode = true;
      this.galleryId = +idParam;
      const state = history.state as { gallery?: GalleryDTO } | undefined;
      if (state?.gallery) {
        this.fillForm(state.gallery);
      } else {
        this.galleryApi.findOne(this.galleryId).subscribe({
          next: (data) => this.fillForm(data),
          error: () => this.errorMsg.set('데이터를 불러오지 못했습니다.'),
        });
      }
    }
  }

  ngOnDestroy() {
    this.editor.destroy();
  }

  private fillForm(gallery: GalleryDTO) {
    this.title = gallery.title;
    this.content = gallery.content;
    this.editor.commands.setContent(gallery.content || '');
    this.eventName = gallery.eventName ?? '';
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

  openEditorImagePicker() {
    this.editorImageInputRef.nativeElement.click();
  }

  onEditorImageSelect(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    this.uploading.set(true);
    this.galleryApi.uploadImage(file).subscribe({
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

  navigateBack() {
    this.router.navigate(['/event/gallery']);
  }

  onSubmit() {
    if (!this.title.trim()) { this.errorMsg.set('갤러리명을 입력해주세요.'); return; }
    const plainText = this.editor.getText().trim();
    if (!plainText) { this.errorMsg.set('내용을 입력해주세요.'); return; }

    this.loading.set(true);
    this.errorMsg.set('');

    const body = {
      title: this.title.trim(),
      content: this.editor.getHTML(),
      eventName: this.eventName.trim() || undefined,
    };

    const request$ = this.isEditMode
      ? this.galleryApi.update(this.galleryId!, body)
      : this.galleryApi.create(body);

    request$.subscribe({
      next: () => {
        this.toast.success(this.isEditMode ? '갤러리가 수정되었습니다.' : '갤러리가 등록되었습니다.');
        this.router.navigate(['/event/gallery']);
      },
      error: () => {
        this.errorMsg.set('저장 중 오류가 발생했습니다.');
        this.loading.set(false);
      },
    });
  }
}
