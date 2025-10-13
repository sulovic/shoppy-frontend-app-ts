import React, { useState } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { toast } from "react-toastify";

const NewDodeljivanjeOdsustva: React.FC = () => {
  const axiosPrivate = useAxiosPrivate();
  const [data, setData] = useState<any>({ vrstaOdsustva: "", brojDana: 0, godina: new Date().getFullYear() });

  const handleSave = async (e: React.FormEvent) => { e.preventDefault(); try { await axiosPrivate.post("odsustva/dodeljena", data); toast.success("Dodeljeno odsustvo je sačuvano"); } catch (error: any) { toast.error(`Greška: ${error}`); } };

  return (
    <div>
      <h3>Dodavanje dodeljivanja odsustva</h3>
      <form onSubmit={handleSave}>
        <label>Vrsta odsustva</label>
        <input id="vrstaOdsustva" value={data.vrstaOdsustva} onChange={(e) => setData({ ...data, vrstaOdsustva: e.target.value })} />
        <label>Broj dana</label>
        <input id="brojDana" type="number" value={data.brojDana} onChange={(e) => setData({ ...data, brojDana: Number(e.target.value) })} />
        <button type="submit" className="button button-sky">Sačuvaj</button>
      </form>
    </div>
  );
};

export default NewDodeljivanjeOdsustva;
