import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  GalleryResponseDto as GalleryDTO,
  galleryControllerCreate,
  galleryControllerFindOne,
  galleryControllerGetEventNames,
  galleryControllerUpdate,
} from '@demo-shop/api-client';
import { map } from 'rxjs/operators';
import { ToastService } from '../../../services/toast.service';
import { RichEditorComponent } from '../../../shared/rich-editor.component';

const TITLE_MAX = 100;

@Component({
  selector: 'app-gallery-form',
  imports: [FormsModule, RichEditorComponent],
  templateUrl: './gallery-form.component.html',
})
export class GalleryFormComponent implements OnInit {
  @ViewChild(RichEditorComponent) editorRef!: RichEditorComponent;

  private http = inject(HttpClient);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private toast = inject(ToastService);

  readonly TITLE_MAX = TITLE_MAX;
  readonly imageUploadUrl = '/api/gallery/upload/image';

  isEditMode = false;
  private galleryId?: number;

  title = '';
  content = '';
  eventName = '';

  loading = signal(false);
  errorMsg = signal('');
  eventNameSuggestions = signal<string[]>([]);

  ngOnInit() {
    galleryControllerGetEventNames(this.http, '').pipe(map(r => r.body.eventNames ?? [])).subscribe({
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
        galleryControllerFindOne(this.http, '', { id: this.galleryId }).pipe(map(r => r.body)).subscribe({
          next: (data) => this.fillForm(data),
          error: () => this.errorMsg.set('데이터를 불러오지 못했습니다.'),
        });
      }
    }
  }

  private fillForm(gallery: GalleryDTO) {
    this.title = gallery.title;
    this.content = gallery.content;
    this.eventName = gallery.eventName ?? '';
  }

  navigateBack() {
    this.router.navigate(['/expo/gallery']);
  }

  onSubmit() {
    if (!this.title.trim()) { this.errorMsg.set('갤러리명을 입력해주세요.'); return; }
    if (!this.editorRef.getText().trim()) { this.errorMsg.set('내용을 입력해주세요.'); return; }

    this.loading.set(true);
    this.errorMsg.set('');

    const body = {
      title: this.title.trim(),
      content: this.content,
      eventName: this.eventName.trim() || undefined,
    };

    const request$ = this.isEditMode
      ? galleryControllerUpdate(this.http, '', { id: this.galleryId ?? 0, body }).pipe(map(r => r.body))
      : galleryControllerCreate(this.http, '', { body }).pipe(map(r => r.body));

    request$.subscribe({
      next: () => {
        this.toast.success(this.isEditMode ? '갤러리가 수정되었습니다.' : '갤러리가 등록되었습니다.');
        this.router.navigate(['/expo/gallery']);
      },
      error: () => {
        this.errorMsg.set('저장 중 오류가 발생했습니다.');
        this.loading.set(false);
      },
    });
  }
}
