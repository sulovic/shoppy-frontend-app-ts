import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Spinner from "../../components/Spinner";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import Modal from "../../components/Modal";
import ModalEditDodeljivanjeOdsustva from "./ModalEditDodeljivanjeOdsustva";
import { useAuth } from "../../Context/AuthContext";

const DodeljivanjeOdsustva: React.FC = () => {
  const [tableData, setTableData] = useState<any[] | null>(null);
  const [showSpinner, setShowSpinner] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showModalEdit, setShowModalEdit] = useState(false);
  const [selectedOdsustvo, setSelectedOdsustvo] = useState<any>({});
  const [updateData, setUpdateData] = useState<any | null>(null);
  const [users, setUsers] = useState<any[] | null>(null);
  const [filter, setFilter] = useState<any>({ user: "*", godina: new Date().getFullYear(), vrstaOdsustva: "*" });
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();
  const { authUser } = useAuth();

  const fetchUsers = async () => { setShowSpinner(true); try { const response = await axiosPrivate.get("users"); setUsers(response?.data); } catch (error: any) { toast.error(`UPS!!! Došlo je do greške: ${error} `, { position: toast.POSITION.TOP_CENTER }); } finally { setShowSpinner(false); } };
  useEffect(() => { fetchUsers(); }, []);

  const fetchData = async () => { setShowSpinner(true); try { const response = await axiosPrivate.get(`odsustva/dodeljena?user=${filter?.user}&godina=${filter?.godina}&vrstaOdsustva=${filter?.vrstaOdsustva}&sortBy=godina`); setTableData(response?.data); } catch (error: any) { toast.error(`UPS!!! Došlo je do greške pri preuzimanju podataka: ${error} `, { position: toast.POSITION.TOP_CENTER }); } finally { setShowSpinner(false); } };
  useEffect(() => { fetchData(); }, [filter]);

  const handleEdit = (row: any) => { setUpdateData(row); setShowModalEdit(true); };
  const handleDelete = (row: any) => { setSelectedOdsustvo(row); setShowModal(true); };

  const handleDeleteOK = async () => { setShowSpinner(true); try { await axiosPrivate.delete(`odsustva/dodeljena/${selectedOdsustvo?.id}`); toast.success(`Dodeljeno odsustvo ${selectedOdsustvo?.user} - ${selectedOdsustvo?.vrstaOdsustva} je uspešno obrisano!`, { position: toast.POSITION.TOP_CENTER }); } catch (error: any) { toast.error(`UPS!!! Došlo je do greške: ${error} `, { position: toast.POSITION.TOP_CENTER }); } finally { setShowModal(false); setShowSpinner(false); fetchData(); } };
  const handleCancel = () => { setSelectedOdsustvo({}); setShowModal(false); setShowSpinner(false); };
  const handleChangeFilter = (e: React.ChangeEvent<HTMLSelectElement>) => { setFilter((prev: any) => ({ ...prev, [e.target.id]: e.target.value })); };

  return (
    <>
      <h3 className="my-4">Dodeljena odsustva</h3>
      <div className="grid grid-cols-1 justify-end gap-4 lg:flex">
        <div className="flex justify-end gap-4">
          <label htmlFor="user">Zaposleni: </label>
          <select id="user" aria-label="Odaberi zaposlenog" required value={filter?.user} onChange={handleChangeFilter}>
            <option value="*">Svi zaposleni</option>
            {users && users.map((user, index) => (<option key={index} value={user?.ime_prezime}>{user?.ime_prezime}</option>))}
          </select>
        </div>
        <div className="flex justify-end gap-4">
          <label htmlFor="zemlja">Godina: </label>
          <select id="godina" aria-label="Odaberi godinu" required value={filter?.godina} onChange={handleChangeFilter}><option value="*">Sve godine</option>{[...Array(7).keys()].map((i) => { const year = new Date().getFullYear() - 3 + i; return (<option key={year} value={year}>{year}</option>); })}</select>
        </div>
        <div className="flex justify-end gap-4">
          <label htmlFor="vrstaOdsustva">Vrsta: </label>
          <select id="vrstaOdsustva" aria-label="Odaberi vrstu odsustva" required value={filter?.vrstaOdsustva} onChange={handleChangeFilter}><option value="*">Sve vrste odsustva</option><option value="GODISNJI_ODMOR">Godišnji odmor</option><option value="PLACENO_ODSUSTVO">Plaćeno odsustvo</option></select>
        </div>
        <button type="button" className="button button-sky " aria-label="Dodeljena odsustva" onClick={() => navigate("/odsustva/novo-dodeljivanje")}>Dodeli novo odsustvo</button>
      </div>
      {tableData?.length ? (<div><div className="relative my-4 overflow-x-auto shadow-lg sm:rounded-lg"><div className="table-responsive p-3"><table className="w-full text-left text-sm text-zinc-500 rtl:text-right dark:text-zinc-400 "><thead className="bg-zinc-200 uppercase text-zinc-600 dark:bg-zinc-700 dark:text-zinc-400"><tr><th className="px-6 py-3">Redni broj</th><th className="px-6 py-3">Zaposleni</th><th className="px-6 py-3">Vrsta Odsustva</th><th className="px-6 py-3">Godina</th><th className="px-6 py-3">Broj dana</th><th className="px-6 py-3">Dodelio</th><th className="px-6 py-3">Izmeni</th><th className="px-6 py-3">Obriši</th></tr></thead><tbody>{tableData.map((row, index) => (<tr key={index} className="border-b bg-white hover:!bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800"><td key={`id${index}`}>{index + 1}</td><td key={`user_${index}`}>{row?.user}</td><td key={`vrstaOdsustva_${index}`}>{row?.vrstaOdsustva}</td><td key={`godina_${index}`}>{row?.godina}</td><td key={`brojDana_${index}`}>{row?.brojDana}</td><td key={`dodelio_${index}`}>{row?.dodelioUser}</td><td key={`edit_${index}`} className="text-center"><button type="button" className="button button-sky float-left" aria-label="Edit" onClick={() => handleEdit(row)}>Izmeni</button></td><td key={`delete_${index}`} className="text-center"><button type="button" className="button button-red float-left" aria-label="Delete" disabled={!authUser?.superAdmin} onClick={() => handleDelete(row)}>Obri1i</button></td></tr>))}</tbody></table>{/* Modal and Spinner component */}{showModal && (<Modal onOK={handleDeleteOK} onCancel={handleCancel} title="Potvrda brisanja dodeljenog odsustva" question={`Da li ste sigurni da želite da obrišete dodeljeno odsustvo: ${selectedOdsustvo?.user} - ${selectedOdsustvo?.vrstaOdsustva}?`} />)}{updateData && showModalEdit && (<ModalEditDodeljivanjeOdsustva setShowModalEdit={setShowModalEdit} updateData={updateData} setUpdateData={setUpdateData} fetchData={fetchData} />)}</div></div></div>) : (!showSpinner && <div className="p-3">Nemate podataka o dodeljenim odsustvima...</div>)}
      {showSpinner && <Spinner />}
    </>
  );
};

export default DodeljivanjeOdsustva;
