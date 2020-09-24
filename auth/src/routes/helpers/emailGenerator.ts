const emailGenerator = () => {
  const date = new Date().toISOString();
  const email = date.replace(/:/g, '') + '@' + 'ya.ru';

  return email;
};

export { emailGenerator };
