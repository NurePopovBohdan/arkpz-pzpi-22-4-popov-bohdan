module.exports = class UserDto {
  email;
  id;
  role;

  constructor(model) {
    this.email = model.email;
    this.id = model._id;
    this.role = model.role;
  }
};
