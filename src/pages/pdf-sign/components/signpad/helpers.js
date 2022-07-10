export default function getAbbrName(name) {
  if (!name) return "";

  const nParts = name.split(" ");
  let abrName = "";
  nParts.map((p) => {
    abrName += p[0];
  });
  return abrName;
}
