/**
 * Класс Sidebar отвечает за работу боковой колонки:
 * кнопки скрытия/показа колонки в мобильной версии сайта
 * и за кнопки меню
 * */
class Sidebar {
  /**
   * Запускает initAuthLinks и initToggleButton
   * */
  static init() {
    this.initAuthLinks();
    this.initToggleButton();
  }

  /**
   * Отвечает за скрытие/показа боковой колонки:
   * переключает два класса для body: sidebar-open и sidebar-collapse
   * при нажатии на кнопку .sidebar-toggle
   * */
  static initToggleButton() {
    const BUTTON = document.querySelector('.sidebar-toggle');
    const BODY = document.querySelector('.skin-blue');
    
    BUTTON.addEventListener('click', () =>{
      if(BODY.classList.contains('sidebar-open') && BODY.classList.contains('sidebar-collapse')){
      BODY.classList.remove('sidebar-open')
      BODY.classList.remove('sidebar-collapse')
      return
      }
      BODY.classList.add('sidebar-open')
      BODY.classList.add('sidebar-collapse')
    })
  }

  /**
   * При нажатии на кнопку входа, показывает окно входа
   * (через найденное в App.getModal)
   * При нажатии на кнопку регастрации показывает окно регистрации
   * При нажатии на кнопку выхода вызывает User.logout и по успешному
   * выходу устанавливает App.setState( 'init' )
   * */
  static initAuthLinks() {
    document.querySelector('.menu-item_login > a').onclick = event => {
      event.preventDefault();
      App.getModal('login').open();
    };
    document.querySelector('.menu-item_register > a').onclick = event => {
      event.preventDefault();
      App.getModal('register').open();
    };
    document.querySelector('.menu-item_logout > a').onclick = event => {
      event.preventDefault();
      User.logout((err, response) => {
        if (response && response.success) App.setState('init');
      });
    };
  }
}