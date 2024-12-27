function calculateDiscount(user) {
    if (user) {
        if (user.isPremium) {
            if (user.purchaseAmount > 1000) {
                return user.purchaseAmount * 0.2;
            }
        }
    }
    return 0;
}

function calculateDiscount(user) {
    if (!user) return 0;
    if (!user.isPremium) return 0;
    if (user.purchaseAmount <= 1000) return 0;
    return user.purchaseAmount * 0.2;
}


// 
class Classroom {
    constructor() {
        this.students = [];
    }
}

const classroom = new Classroom();
classroom.students.push("John");
classroom.students.push("Jane");


class Classroom {
    constructor() {
        this._students = [];
    }

    addStudent(student) {
        this._students.push(student);
    }

    getStudents() {
        return [...this._students];
    }
}

const classroom = new Classroom();
classroom.addStudent("John");
classroom.addStudent("Jane");


// 

function getShippingCost(order) {
    switch (order.type) {
        case "standard":
            return 5;
        case "express":
            return 10;
        case "overnight":
            return 20;
        default:
            throw new Error("Unknown order type");
    }
}

class Order {
    getShippingCost() {
        throw new Error("Must be implemented in subclass");
    }
}

class StandardOrder extends Order {
    getShippingCost() {
        return 5;
    }
}

class ExpressOrder extends Order {
    getShippingCost() {
        return 10;
    }
}

class OvernightOrder extends Order {
    getShippingCost() {
        return 20;
    }
}

const order = new ExpressOrder();
console.log(order.getShippingCost()); // 10
