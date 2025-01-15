module.exports = class UserDto {
  email;
  id;
  role;

  constructor(model) {
    if (!model || !model.email || !model._id || !model.role) {
      throw new Error("Invalid model provided to UserDto constructor");
    }

    this.email = model.email;
    this.id = model._id.toString(); // Ensure the ID is a string
    this.role = model.role;
  }
};
