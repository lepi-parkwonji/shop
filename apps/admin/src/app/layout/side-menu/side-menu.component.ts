import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

interface Menu {
  name: string;
  children?: { name: string; href: string }[];
}

const MENUS: Menu[] = [
  {
    name: '고객센터',
    children: [
      { name: '공지사항', href: '/customer/notice' },
      { name: 'FAQ', href: '/customer/faq' },
    ],
  },
];

@Component({
  selector: 'app-side-menu',
  imports: [RouterLink, RouterLinkActive],
  template: `
    <nav class="w-56 min-h-full bg-neutral text-neutral-content pt-4">
      @for (menu of menus; track menu.name) {
        <div class="mb-2">
          <p class="px-5 py-2 text-xs font-semibold uppercase tracking-wider text-neutral-content/40">
            {{ menu.name }}
          </p>
          @for (child of menu.children; track child.href) {
            <a
              [routerLink]="child.href"
              routerLinkActive="bg-neutral-focus font-medium"
              class="block px-5 py-2.5 text-sm text-neutral-content/70 hover:bg-neutral-focus hover:text-neutral-content transition-colors"
            >{{ child.name }}</a>
          }
        </div>
      }
    </nav>
  `,
})
export class SideMenuComponent {
  menus = MENUS;
}
