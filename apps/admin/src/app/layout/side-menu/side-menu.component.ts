import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

interface Menu {
  name: string;
  children?: { name: string; href: string }[];
}

const MENUS: Menu[] = [
  {
    name: '고객센터 관리',
    children: [
      { name: '공지사항', href: '/customer/notice' },
      { name: 'FAQ', href: '/customer/faq' },
      { name: '문의하기', href: '/customer/inquiry' },
    ],
  },
  {
    name: '행사 운영 관리',
    children: [
      { name: '행사 일정 관리', href: '/event/schedule' },
      { name: '참가 업체 관리', href: '/event/exhibitor' },
      { name: '관람 신청 관리', href: '/event/registration' },      
    ],
  },
  {
    name: '갤러리/보도자료',
    children: [
      { name: '갤러리 관리', href: '/event/gallery' },
      { name: '보도자료 관리', href: '/event/press' },    
    ],
  },
];

@Component({
  selector: 'app-side-menu',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './side-menu.component.html',
})
export class SideMenuComponent {
  menus = MENUS;
}
