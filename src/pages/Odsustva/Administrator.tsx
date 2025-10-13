import React from "react";
import AppMenu from "../../components/AppMenu";
import { Link } from "react-router-dom";

const Administrator: React.FC = () => {
  return (
    <div>
      <AppMenu />
      <div className="p-4">
        <h3>Administracija odsustava</h3>
        <ul>
          <li><Link to="dodeljivanje">Dodeljivanje odsustva</Link></li>
          <li><Link to="odobravanje">Odobravanje odsustva</Link></li>
          <li><Link to="stampa">Štampa rešenja</Link></li>
        </ul>
      </div>
    </div>
  );
};

export default Administrator;
import React, { useState, useEffect } from "react";
import moment from "moment";
import DatePicker from "react-datepicker";
import "react-big-calendar/lib/css/react-big-calendar.css";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { useAuth } from "../../Context/AuthContext";
import Modal from "../../components/Modal";
import { toast } from "react-toastify";
import Spinner from "../../components/Spinner";
import Kalendar from "./KalendarComponent.jsx/Kalendar";
import Pagination from "../../components/Pagination";

const Administrator: React.FC = () => {
  const { authUser } = useAuth();
  const [selectedUserOdsustva, setSelectedUserOdsustva] = useState<any[]>([]);
  const [svaOdsustva, setSvaOdsustva] = useState<any[]>([]);
  const [dodeljenaOdsustva, setDodeljenaOdsustva] = useState<any[]>([]);
  const [selectedOdsustvo, setSelectedOdsustvo] = useState<any | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showSpinner, setShowSpinner] = useState(false);
  const [users, setUsers] = useState<any[] | null>(null);
  const [selectedUser, setSelectedUser] = useState<any>({ user: authUser?.name });
  const axiosPrivate = useAxiosPrivate();
  const [pagination, setPagination] = useState<any>({ limit: 10, page: 1, count: 0 });
  const [novoOdsustvo, setNovoOdsustvo] = useState<any>({ user: selectedUser?.user, vrstaOdsustva: "", start: null, end: null, brojDana: 0, odobreno: false });

  const fetchUsers = async () => {
    setShowSpinner(true);
    try {
      const response = await axiosPrivate.get("users");
      setUsers(response?.data);
    } catch (error: any) {
      toast.error(`UPS!!! Došlo je do greške: ${error} `, { position: toast.POSITION.TOP_CENTER });
    } finally {
      setShowSpinner(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchOdustva = async () => {
    setShowSpinner(true);
    try {
      const responseSelectedUserOdustva = await axiosPrivate.get(`odsustva/evidencija?user=${selectedUser?.user}&sortBy=start&sortOrder=desc&page=${pagination.page}&limit=${pagination.limit}`);
      setSelectedUserOdsustva(responseSelectedUserOdustva?.data?.data);
      setPagination({ ...pagination, count: responseSelectedUserOdustva?.data?.count });
      const responseDodeljena = await axiosPrivate.get(`odsustva/dodeljena?user=${selectedUser?.user}`);
      setDodeljenaOdsustva(responseDodeljena?.data);
      const responseSvaOdustva = await axiosPrivate.get(`odsustva/evidencija?sortBy=start&sortOrder=desc`);
      setSvaOdsustva(responseSvaOdustva?.data?.data);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error: any) {
      toast.error(`UPS!!! Došlo je do greške pri preuzimanju proizvoda: ${error} `, { position: toast.POSITION.TOP_CENTER });
    } finally {
      setShowSpinner(false);
    }
  };

  useEffect(() => {
    fetchOdustva();
  }, [selectedUser, pagination.page, pagination.limit]);

  const handleAddEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    setShowSpinner(true);
    try {
      const response = await axiosPrivate.post("odsustva/evidencija", novoOdsustvo);
      toast.success(`Novo odsustvo: ${response?.data?.vrstaOdsustva} - ${response?.data?.brojDana} dana je uspešno dodato!`, { position: toast.POSITION.TOP_CENTER });
    } catch (error: any) {
      toast.error(`UPS!!! Došlo je do greške: ${error} `, { position: toast.POSITION.TOP_CENTER });
    } finally {
      setShowModal(false);
      setShowSpinner(false);
    }
    setNovoOdsustvo({ user: selectedUser?.user, vrstaOdsustva: "", start: null, end: null, brojDana: 0, odobreno: false });
    fetchOdustva();
  };

  const handleChange = (e: React.ChangeEvent<any>) => {
    setNovoOdsustvo((prev: any) => ({ ...prev, [e.target.id]: e.target.value }));
  };
  const handleChangeUser = (e: React.ChangeEvent<any>) => {
    setSelectedUser((prev: any) => ({ ...prev, [e.target.id]: e.target.value }));
    setNovoOdsustvo((prev: any) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleDelete = (event: any) => {
    setSelectedOdsustvo(event);
    setShowModal(true);
  };

  const handleDeleteCancel = () => {
    setShowModal(false);
  };
  const handleDeleteOk = async () => {
    setShowSpinner(true);
    try {
      await axiosPrivate.delete(`odsustva/evidencija/${selectedOdsustvo?.id}`);
      toast.success(`Odsustvo ${selectedOdsustvo?.vrstaOdsustva} - ${selectedOdsustvo?.brojDana} dana je uspešno obrisano!`, { position: toast.POSITION.TOP_CENTER });
    } catch (error: any) {
      toast.error(`UPS!!! Došlo je do greške: ${error} `, { position: toast.POSITION.TOP_CENTER });
    } finally {
      setSelectedOdsustvo(null);
      setShowModal(false);
      setShowSpinner(false);
      fetchOdustva();
    }
  };

  const calculateRaspolozivoGodisnji = (dodeljeno: any[], iskorisceno: any[]) => {
    let raspolozivo = 0;
    dodeljeno.forEach((row) => { if (row?.vrstaOdsustva === "GODISNJI_ODMOR") { raspolozivo = raspolozivo + row?.brojDana; } });
    iskorisceno.forEach((row) => { if (row?.vrstaOdsustva === "GODISNJI_ODMOR") { raspolozivo = raspolozivo - row?.brojDana; } });
    return raspolozivo;
  };

  let raspolozivoGodisnji = calculateRaspolozivoGodisnji(dodeljenaOdsustva, selectedUserOdsustva);

  const calculateDays = (obj: any) => {
    const { start, end } = obj;
    if (start === null || end === null) { obj.brojDana = 0; return obj; }
    let totalDays = 0; let currentDate = new Date(obj.start);
    while (currentDate <= end) { const dayOfWeek = currentDate.getDay(); if (dayOfWeek !== 0 && dayOfWeek !== 6) { totalDays++; } currentDate.setDate(currentDate.getDate() + 1); }
    obj.brojDana = totalDays; return obj;
  };

  return (
    <>
      <div className="my-3 mt-4 flex h-full w-full items-center justify-center gap-2">
        <div className="grid w-full grid-cols-1 justify-center gap-8 px-4 xl:grid-cols-2">
          <Kalendar odsustva={svaOdsustva} />
          <div className="rounded-xl border-2 border-solid border-zinc-100 bg-gray-100 p-4  shadow-sm  dark:bg-gray-800">
            <form onSubmit={handleAddEvent}>
              <div className="mx-auto grid grid-cols-2 gap-2">
                <h3 className="col-span-2 text-center">Unos odsustva - {selectedUser?.user}</h3>
                <div>
                  <label htmlFor="user">Zaposleni </label>
                  <select id="user" aria-label="Odaberi zaposlenog" required value={selectedUser?.user} onChange={handleChangeUser}>
                    {users && users.map((user, index) => (<option key={index} value={user?.ime_prezime}>{user?.ime_prezime}</option>))}
                  </select>
                </div>
                <div>
                  <label htmlFor="vrstaOdsustva">Vrsta odsustva</label>
                  <select id="vrstaOdsustva" aria-label="Odaberi vrstu odsustva" required value={novoOdsustvo?.vrstaOdsustva} onChange={handleChange}>
                    <option value="">Odaberite tip odsustva</option>
                    <option value="GODISNJI_ODMOR">Godišnji odmor - Raspoloživo: {raspolozivoGodisnji}</option>
                    <option value="PLACENO_ODSUSTVO">Plaćeno odsustvo</option>
                    <option value="SLUZBENI_PUT_U_ZEMLJI">Službeni put u zemlji</option>
                    <option value="SLUZBENI_PUT_U_INOSTRANSTVO">Službeni put u inostranstvo</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="start">Početak odsustva</label>
                  <DatePicker id="start" locale="sr-Latn" autoComplete="off" maxDate={novoOdsustvo?.end} selected={novoOdsustvo?.start} onChange={(date) => { setNovoOdsustvo((prev: any) => { const newData = { ...prev, start: new Date(date) }; return calculateDays(newData); }); }} dateFormat="dd - MM - yyyy" required />
                </div>
                <div>
                  <label htmlFor="end">Zavr1etak odsustva</label>
                  <DatePicker id="end" locale="sr-Latn" autoComplete="off" selected={novoOdsustvo?.end} minDate={novoOdsustvo?.start} onChange={(date) => { setNovoOdsustvo((prev: any) => { const newData = { ...prev, end: new Date((date as Date).setHours(23)) }; return calculateDays(newData); }); }} dateFormat="dd - MM - yyyy" required />
                </div>
                <div className="col-span-2 mt-2 flex flex-row-reverse gap-2">
                  <button type="submit" className="button button-sky" disabled={novoOdsustvo?.vrstaOdsustva === "GODISNJI_ODMOR" && raspolozivoGodisnji < calculateDays(novoOdsustvo)?.brojDana}>Dodaj odsustvo: {calculateDays(novoOdsustvo)?.brojDana} dana</button>
                </div>
              </div>
            </form>
            <div className="my-4 h-0.5 w-full bg-zinc-400"></div>
            <div className="mt-0 overflow-x-auto">
              <h4>Uneta odsustva</h4>
              <table className=" mt-4 w-full  text-center text-sm text-zinc-500 rtl:text-right dark:text-zinc-400 ">
                <thead className=" bg-zinc-200 uppercase text-zinc-600 dark:bg-zinc-700 dark:text-zinc-400">
                  <tr>
                    <th className="px-2 py-3">Po1etak</th>
                    <th className="px-2 py-3">Kraj</th>
                    <th className="px-2 py-3">Vrsta</th>
                    <th className="px-2 py-3">Broj</th>
                    <th className="px-2 py-3">Odobreno</th>
                    <th className="px-2 py-3">Od1tampaj</th>
                    <th className="px-2 py-3">Obri1i</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedUserOdsustva?.length ? (selectedUserOdsustva.map((row, index) => (
                    <tr key={index} className="border-b bg-white text-center hover:!bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800">
                      <td key={`start_${index}`}>{row?.start ? moment(row?.start).format("DD-MM-YYYY") : ""}</td>
                      <td key={`end_${index}`}>{row?.end ? moment(row?.end).format("DD-MM-YYYY") : ""}</td>
                      <td key={`vrstaOdsustva_${index}`}>{row?.vrstaOdsustva}</td>
                      <td key={`brojDana_${index}`}>{row?.brojDana}</td>
                      <td key={`odobreno_${index}`}><input type="checkbox" checked={row?.odobreno} disabled className="h-4 w-4 appearance-auto rounded border-zinc-300 bg-zinc-100 p-2 text-zinc-600 focus:ring-2 focus:ring-zinc-500 dark:border-zinc-600 dark:bg-zinc-700 dark:ring-offset-zinc-800 dark:focus:ring-zinc-600" /></td>
                      <td key={`print_${index}`} className="text-center"><button type="button" className="button button-sky" aria-label="Od1tampaj" disabled={row?.vrstaOdsustva !== "GODISNJI_ODMOR" || !row?.odobreno} onClick={() => window.open(`/odsustva/resenje-odmor/${row?.id}`, "_blank")}>Od1tampaj</button></td>
                      <td key={`delete_${index}`} className="text-center"><button type="button" className="button button-red" aria-label="Delete" disabled={!authUser?.superAdmin} onClick={() => handleDelete(row)}>Obri1i</button></td>
                    </tr>
                  ))) : (<tr className="border-b bg-white text-center hover:!bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800"><td colSpan={7}>Nemate unetih zahteva za odsustvo...</td></tr>)}
                </tbody>
              </table>
              {!showSpinner && <Pagination pagination={pagination} setPagination={setPagination} />}
            </div>
            <div className="mt-0 overflow-x-auto">
              <h4>Dodeljena odsustva</h4>
              <table className=" mt-4 w-full  text-center text-sm text-zinc-500 rtl:text-right dark:text-zinc-400 ">
                <thead className=" bg-zinc-200 uppercase text-zinc-600 dark:bg-zinc-700 dark:text-zinc-400">
                  <tr>
                    <th className="px-2 py-3">Vrsta odsustva</th>
                    <th className="px-2 py-3">Godina</th>
                    <th className="px-2 py-3">Broj dana</th>
                  </tr>
                </thead>
                <tbody>
                  {dodeljenaOdsustva?.length ? (dodeljenaOdsustva.map((row, index) => (
                    <tr key={index} className="border-b bg-white text-center hover:!bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800"><td key={`vrstaOdsustva_${index}`}>{row?.vrstaOdsustva}</td><td key={`godina_${index}`}>{row?.godina}</td><td key={`brojDana_${index}`}>{row?.brojDana}</td></tr>
                  ))) : (<tr className="border-b bg-white text-center hover:!bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800"><td colSpan={3}>Nema dodeljenih odsustva...</td></tr>)}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      {showModal && (<Modal onOK={handleDeleteOk} onCancel={handleDeleteCancel} title="Potvrda brisanja unetog odsustva" question={`Da li ste sigurni da želite da obrišete uneto odsustvo: ${selectedOdsustvo?.user} - ${selectedOdsustvo?.vrstaOdsustva} - ${selectedOdsustvo?.brojDana} dana?`} />)}
      {showSpinner && <Spinner />}
    </>
  );
};

export default Administrator;
