export const getExpiresOn = () => {
  const now = new Date();
  now.setDate(now.getDate() + 10);
  return now.getTime();
};
