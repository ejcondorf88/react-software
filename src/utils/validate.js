export const validateForm = (data) => {
  const errors = {};

  if (!data.email) {
    errors.email = "Email is required";
  }

  if (!data.name) {
    errors.name = "Name is required";
  }

  if (!data.lastName) {
    errors.lastName = "Last name is required";
  }

  if (!data.rol) {
    errors.rol = "Role is required";
  }

  return errors;
};

export const validateLoginForm = (data) => {
  const errors = {};

  if (!data.userName) {
    errors.userName = "User name is required";
  }

  if (!data.password) {
    errors.password = "Password is required";
  }

  return errors;
};
