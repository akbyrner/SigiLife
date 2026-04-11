import { useNavigate, useSearchParams } from "react-router-dom";
import SigilThumb from "./SigilThumb"



export default function SigiLibrary({ items, }: { items: any[], user: any }) {
  const [searchParams] = useSearchParams();
  const action = searchParams.get('action')
  const navigate = useNavigate();


  const handleSigilClick = (sigil:any) => {
    if (action === 'charge'){
      navigate(`/charge-sigil?sigilId=${sigil.id}`)
    } else if (action === 'destroy'){
      navigate(`/destroy-sigil?sigilId=${sigil.id}`)
    } else {
      navigate(`/sigil-page?sigilId=${sigil.id}`)
    }
  }

  if (!items) {
    return (
      <p>loading...</p>
    )
  }



 return (
        <div className="sigilibrary">
          {items.map((sigil: any) => (
            <SigilThumb
              key={sigil.id}
              sigilData={sigil}
                        onClick={() => handleSigilClick(sigil)}
            />
          ))}
        </div>

    );
  };