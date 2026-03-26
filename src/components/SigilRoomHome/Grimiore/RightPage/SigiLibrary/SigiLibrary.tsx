import SigilThumb from "./SigilThumb"

export default function SigiLibrary({ items }: { items: any }) {
  console.log(items)
  const mapItems = items.flatMap((item: any) => Object.entries(item));

  return (
    <div className="sigilibrary">
      {mapItems.flatMap(([sigilKey, sigilData]: [any, any]) => (
        <SigilThumb
        key={sigilKey}
        sigilKey={sigilKey}
        sigilData={sigilData} />
      ))}
    </div>
  );
};