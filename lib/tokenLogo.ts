const tokenLogo = (CG_ID: string) => {
  if (!CG_ID) return "";
  return `https://tokenmetrics.s3.amazonaws.com/icons/${CG_ID.toLowerCase().replace(/ /g, "-")}_large.png`;
};

export default tokenLogo;
