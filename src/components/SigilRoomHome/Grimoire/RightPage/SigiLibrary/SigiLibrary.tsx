import SigilThumb from "./SigilThumb"


export default function SigiLibrary({ items, }: { items: any[], user: any }) {
  if (!items) {
    return (
      <p>loading...</p>
    )
  }

 return (
      <div className="flex flex-col w-full p-4 pb-20">

        <div className="sigilibrary flex-1 overflow-auto mt-4">
          {items.map((sigil: any) => (
            <SigilThumb
              key={sigil.id}
              sigilData={sigil}
            />
          ))}
        </div>


      </div>
    );
  };