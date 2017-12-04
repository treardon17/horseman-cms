import { observable, computed } from 'mobx';
import TypeState from './TypeState.js';

class AppState {
  @observable circleMenuItems = [
    { icon: '/assets/img/featherIcons/layout.svg', onClick: TypeState.addEmptyType.bind(TypeState) },
    { icon: '/assets/img/featherIcons/image.svg', onClick: () => {} },
    { icon: '/assets/img/featherIcons/layers.svg', onClick: () => {} }
  ];

  @observable menuItems = [
    { icon: "/assets/img/featherIcons/home.svg", title: "Home", url: "/" },
    { icon: "/assets/img/featherIcons/users.svg", title: "Users", url: "/users" },
    { icon: "/assets/img/featherIcons/image.svg", title: "Assets", url: "/assets" },
    { icon: "/assets/img/featherIcons/layout.svg", title: "Modules", url: "/modules" },
    { icon: "/assets/img/featherIcons/layers.svg", title: "Objects", url: "/objects" },
    { icon: "/assets/img/featherIcons/settings.svg", title: "Settings", url: "/settings" }
  ];
}

export default AppState;
