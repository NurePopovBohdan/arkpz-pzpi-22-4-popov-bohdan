const Router = require("express").Router;
const adminMiddleware = require("../middlewares/admin-middleware.js");
const adminController = require("../controllers/admin-controller.js");
const vehicleController = require("../controllers/vehicle-controller");

const router = new Router();

// Получение списка всех пользователей
router.get("/users", adminController.getUsers);

//

// Удаление пользователя
router.delete("/users/:id", adminController.deleteUser);

// Получение списка всех транспортных средств
router.get("/vehicles", adminMiddleware, vehicleController.getAllVehicles);

// Добавление нового транспортного средства
router.post("/vehicles", vehicleController.addVehicle);

// Обновление информации о транспортном средстве
router.put("/vehicles/:id", vehicleController.updateVehicle);

// Удаление транспортного средства
router.delete("/vehicles/:id", vehicleController.deleteVehicle);

module.exports = router;
