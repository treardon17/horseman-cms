import { observable, computed } from 'mobx';
import TypeState from './TypeState.js';

class AppState {
  @observable circleMenuItems = [
    { icon: '/assets/img/icons/layout.svg', onClick: TypeState.addEmptyType.bind(TypeState) },
    { icon: '/assets/img/icons/image.svg', onClick: () => {} },
    { icon: '/assets/img/icons/layers.svg', onClick: () => {} }
  ];

  @observable menuItems = [
    { icon: "/assets/img/icons/home.svg", title: "Home", url: "/" },
    { icon: "/assets/img/icons/users.svg", title: "Users", url: "/users" },
    { icon: "/assets/img/icons/image.svg", title: "Assets", url: "/assets" },
    { icon: "/assets/img/icons/layout.svg", title: "Modules", url: "/modules" },
    { icon: "/assets/img/icons/layers.svg", title: "Objects", url: "/objects" },
    { icon: "/assets/img/icons/settings.svg", title: "Settings", url: "/settings" }
  ];
}

export default AppState;
