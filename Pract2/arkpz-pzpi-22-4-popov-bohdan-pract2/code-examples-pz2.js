function processOrder(order) {
  if (order) {
    if (order.items && order.items.length > 0) {
      if (order.payment && order.payment.status === "paid") {
        console.log("Обробка замовлення:", order.id);
      } else {
        console.log("Оплата не завершена для замовлення:", order.id);
      }
    } else {
      console.log("Замовлення не містить товарів:", order.id);
    }
  } else {
    console.log("Неправильне замовлення.");
  }
}


function processOrder(order) {
  if (!order) {
    console.log("Неправильне замовлення.");
    return;
  }

  if (!order.items || order.items.length === 0) {
    console.log("Замовлення не містить товарів:", order.id);
    return;
  }

  if (!order.payment || order.payment.status !== "paid") {
    console.log("Оплата не завершена для замовлення:", order.id);
    return;
  }

  console.log("Обробка замовлення:", order.id);
}


class Order {
  constructor() {
    this.items = [];
  }

  addItem(item) {
    this.items.push(item);
  }

  removeItem(item) {
    const index = this.items.indexOf(item);
    if (index > -1) {
      this.items.splice(index, 1);
    }
  }
}

const order = new Order();
order.items.push("товар 1"); // Прямий доступ до колекції
console.log(order.items);



class Order {
  constructor() {
    this._items = []; // Інкапсульована колекція
  }

  addItem(item) {
    this._items.push(item);
  }

  removeItem(item) {
    const index = this._items.indexOf(item);
    if (index > -1) {
      this._items.splice(index, 1);
    }
  }

  getItems() {
    return [...this._items]; // Повертаємо копію колекції
  }
}

const order = ne


class Employee {
  constructor(type) {
    this.type = type;
  }

  calculatePay() {
    if (this.type === "manager") {
      return 5000;
    } else if (this.type === "developer") {
      return 4000;
    } else if (this.type === "intern") {
      return 2000;
    }
    return 0;
  }
}

const manager = new Employee("manager");
console.log(manager.calculatePay());



class Employee {
  calculatePay() {
    throw new Error("Метод має бути реалізований у підкласі.");
  }
}

class Manager extends Employee {
  calculatePay() {
    return 5000;
  }
}

class Developer extends Employee {
  calculatePay() {
    return 4000;
  }
}

class Intern extends Employee {
  calculatePay() {
    return 2000;
  }
}

const employees = [new Manager(), new Developer(), new Intern()];
employees.forEach(employee => console.log(employee.calculatePay()));
