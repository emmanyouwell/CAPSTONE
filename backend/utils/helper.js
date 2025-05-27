export const calculateAge = (birthday) => {
  const birthDate = new Date(birthday);
  const today = new Date();

  let years = today.getFullYear() - birthDate.getFullYear();
  let months = today.getMonth() - birthDate.getMonth();

  if (today.getDate() < birthDate.getDate()) {
    months--;
  }

  if (months < 0) {
    years--;
    months += 12;
  }

  if (years >= 1) {
    return { age: years, isYear: true };
  } else {
    return { age: months, isYear: false };
  }
};
