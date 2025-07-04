import { validate } from "class-validator";


export const validator = async (data : Object ) => {
  const validateErrors = await validate(data);
  let checked = null

  if (validateErrors.length > 0) {
    const formattedErrors = validateErrors.reduce((acc, err) => {
      if (err.constraints) {
        acc[err.property] = Object.values(err.constraints);
      }
      return acc;
    }, {} as Record<string, string[]>);

   checked = formattedErrors
  }
  return checked
};
