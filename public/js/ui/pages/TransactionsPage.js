/**
 * Класс TransactionsPage управляет
 * страницей отображения доходов и
 * расходов конкретного счёта
 * */
class TransactionsPage {
  /**
   * Если переданный элемент не существует,
   * необходимо выкинуть ошибку.
   * Сохраняет переданный элемент и регистрирует события
   * через registerEvents()
   * */
  constructor(element) {
    if (!element) {
      throw new Error('пустой элемент');
    }
    this.element = element;
    this.registerEvents();
  }

  /**
   * Вызывает метод render для отрисовки страницы
   * */
  update() {
    if (this.lastOptions) {
      this.render(this.lastOptions)
    }
    return
  }

  /**
   * Отслеживает нажатие на кнопку удаления транзакции
   * и удаления самого счёта. Внутри обработчика пользуйтесь
   * методами TransactionsPage.removeTransaction и
   * TransactionsPage.removeAccount соответственно
   * */
  registerEvents() {
    this.element.addEventListener('click', (event) => {
      if (event.target.closest('.transaction__remove')) {
        this.removeTransaction(event.target.closest('.transaction__remove').dataset.id);
        return;
      }
      if (event.target.closest('.remove-account')) {
        this.removeAccount();
        return;
      }
    });
  }

  /**
   * Удаляет счёт. Необходимо показать диаголовое окно (с помощью confirm())
   * Если пользователь согласен удалить счёт, вызовите
   * Account.remove, а также TransactionsPage.clear с
   * пустыми данными для того, чтобы очистить страницу.
   * По успешному удалению необходимо вызвать метод App.updateWidgets() и App.updateForms(),
   * либо обновляйте только виджет со счетами и формы создания дохода и расхода
   * для обновления приложения
   * */
  removeAccount() {
    if (!this.lastOptions) {
      return;
    }
    if (confirm('Вы действительно хотите удалить счёт?')) {
      Account.remove({ id: this.lastOptions.account_id }, (err, response) => {
        if (response && response.success) {
          App.updateWidgets();
          App.updateForms();
          this.clear();
        }
      });
    }
  }

  /**
   * Удаляет транзакцию (доход или расход). Требует
   * подтверждеия действия (с помощью confirm()).
   * По удалению транзакции вызовите метод App.update(),
   * либо обновляйте текущую страницу (метод update) и виджет со счетами
   * */
  removeTransaction(id) {
    if (confirm('Вы действительно хотите удалить эту транзакцию?')) {
      Transaction.remove({ id }, (err, response) => {
        if (response && response.success) {
          App.update();
        }
      });
    }
  }

  /**
   * С помощью Account.get() получает название счёта и отображает
   * его через TransactionsPage.renderTitle.
   * Получает список Transaction.list и полученные данные передаёт
   * в TransactionsPage.renderTransactions()
   * */
  render(options) {
    if (!options) {
      return
    }
    this.lastOptions = options;
    Account.get(options.account_id, (err, response) => {
      if (response && response.success) {
        this.renderTitle(response.data.name);
      }
    });
    Transaction.list(options, (err, response) => {
      this.renderTransactions(response.data);
    });
  }

  /**
   * Очищает страницу. Вызывает
   * TransactionsPage.renderTransactions() с пустым массивом.
   * Устанавливает заголовок: «Название счёта»
   * */
  clear() {
    this.renderTransactions([]);
    this.renderTitle('Название счёта');
    this.lastOptions = null;
  }

  /**
   * Устанавливает заголовок в элемент .content-title
   * */
  renderTitle(name) {
    this.element.querySelector('.content-title').textContent = name;
  }

  /**
   * Форматирует дату в формате 2019-03-10 03:20:41 (строка)
   * в формат «10 марта 2019 г. в 03:20»
   * */
  formatDate(date) {
    let nowDate = new Date(date);
    let day = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    let time = {
      hour: 'numeric',
      minute: 'numeric',
    };
    return `${nowDate.toLocaleString("ru", day)}  в ${nowDate.toLocaleString("ru", time)}`
  }

  /**
   * Формирует HTML-код транзакции (дохода или расхода).
   * item - объект с информацией о транзакции
   * */
  getTransactionHTML(item) {
    let created_at = this.formatDate(item.created_at);
    let id = item.id;
    let name = item.name;
    let sum = item.sum;
    let type = item.type;

    return `
    <div class="transaction transaction_${type} row">
      <div class="col-md-7 transaction__details">
        <div class="transaction__icon">
          <span class="fa fa-money fa-2x"></span>
      </div>
      <div class="transaction__info">
          <h4 class="transaction__title">${name}</h4>
          
          <div class="transaction__date">${created_at}</div>
      </div>
    </div>
    <div class="col-md-3">
      <div class="transaction__summ">
      
          ${sum} <span class="currency">₽</span>
      </div>
    </div>
      <div class="col-md-2 transaction__controls">
        
        <button class="btn btn-danger transaction__remove" data-id="${id}">
            <i class="fa fa-trash"></i>  
        </button>
      </div>
    </div>`
  }

  /**
   * Отрисовывает список транзакций на странице
   * используя getTransactionHTML
   * */
  renderTransactions(data) {
    const CONTENT = this.element.querySelector('.content');
    CONTENT.innerHTML = '';
    for (let item of data) {
      CONTENT.innerHTML += this.getTransactionHTML(item);
    }
  }
}