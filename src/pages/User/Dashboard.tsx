import { useEffect, useState } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import Modal from "../../components/Modal";
import ModalEditUser from "../../components/Users/ModalEditUser";
import { toast } from "react-toastify";
import Spinner from "../../components/Spinner";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import dataServiceBuilder from "../../services/dataService";
import { handleCustomErrors } from "../../services/errorHandler";
import Search from "../../components/Search";
import Pagination from "../../components/Pagination";
import Filters from "../../components/Filters";

const Dashboard: React.FC = () => {
  const [tableData, setTableData] = useState<UserData[]>([]);
  const [showSpinner, setShowSpinner] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showModalEditUser, setShowModalEditUser] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();
  const { authUser } = useAuth();
  const tableHeaders = ["Ime i prezime", "Email", "Nivo ovlašćenja"];
  const userService = dataServiceBuilder<UserData>(axiosPrivate, authUser, "users");
  const [queryParams, setQueryParams] = useState<QueryParams>({ filters: {}, page: 1, limit: 20, sortOrder: "desc", sortBy: "userId" });

  const filtersOptions: FiltersOptions = {
    roleId: ["1001", "3001", "5001"],
  };

  const fetchData = async () => {
    setShowSpinner(true);

    try {
      const response = await userService.getAllResources(queryParams);
      setTableData(response.data.data || []);
    } catch (error) {
      handleCustomErrors(error as string);
    } finally {
      setShowSpinner(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryParams.filters, queryParams.search, queryParams.page, queryParams.limit, queryParams.sortOrder, queryParams.sortBy]);

  const handleDeleteOK = async () => {
    setShowSpinner(true);
    try {
      if (!selectedUser) return;
      const response = await userService.deleteResource(selectedUser.userId);
      const deletedUser = response.data.data;
      toast.success(`Korisnik ${deletedUser?.firstName} ${deletedUser?.lastName} - ${deletedUser?.email} je uspešno obrisan!`, {
        position: "top-center",
      });
    } catch (error) {
      handleCustomErrors(error as string);
    } finally {
      setShowModal(false);
      setShowSpinner(false);
      fetchData();
    }
  };

  const handleDelete = (user: UserData) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const handleCancel = () => {
    setShowModal(false);
    setShowSpinner(false);
  };

  const handleEdit = (user: UserData) => {
    setSelectedUser(user);
    setShowModalEditUser(true);
  };

  return (
    <>
      <h3 className="mt-4">Korisnici - Kontrolna tabla</h3>

      <div className="flex justify-end p-3">
        <button type="button" className="button button-sky " aria-label="EditUser" onClick={() => navigate("/users/new-user")}>
          Dodaj korisnika
        </button>
      </div>

      <div className="mb-4 flex gap-4 justify-end ">
        <Filters filtersOptions={filtersOptions} queryParams={queryParams} setQueryParams={setQueryParams} />
        <Search queryParams={queryParams} setQueryParams={setQueryParams} />
      </div>

      {tableData?.length ? (
        <div>
          <div className="relative my-4 overflow-x-auto shadow-lg sm:rounded-lg">
            <div className="table-responsive ">
              <table className="w-full text-left text-sm text-zinc-500 rtl:text-right dark:text-zinc-400 ">
                <thead className=" bg-zinc-200 uppercase text-zinc-600 dark:bg-zinc-700 dark:text-zinc-400">
                  <tr>
                    {tableHeaders.map((tableKey, index) => (
                      <th className="px-6 py-3" key={index}>
                        {tableKey}
                      </th>
                    ))}
                    <th className="px-6 py-3" key="editUser">
                      Izmeni korisnika
                    </th>
                    <th className="px-6 py-3" key="deleteUser">
                      Obriši korisnika
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {tableData.map((row, index) => (
                    <tr key={index} className="border-b bg-white hover:bg-zinc-100! dark:border-zinc-700 dark:bg-zinc-800">
                      <td key={`ime_prezime_${index}`}>
                        {row.firstName} {row.lastName}
                      </td>
                      <td key={`email_${index}`}>{row.email}</td>
                      <td key={`role_${index}`}>{row.roleName}</td>
                      <td key={`editUser_${index}`} className="text-center">
                        <button type="button" className="button button-sky" aria-label="EditUser" disabled={authUser?.email === row?.email} onClick={() => handleEdit(row)}>
                          Izmeni
                        </button>
                      </td>
                      <td key={`deleteUser_${index}`} className="text-center">
                        <button type="button" className="button button-red" aria-label="Delete" disabled={authUser?.email === row?.email || !authUser?.superAdmin} onClick={() => handleDelete(row)}>
                          Obriši
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="flex justify-end gap-4 my-4">
                <Pagination queryParams={queryParams} setQueryParams={setQueryParams} />
              </div>

              {showModal && (
                <Modal
                  onOK={handleDeleteOK}
                  onCancel={handleCancel}
                  title="Potvrda brisanja korisnika"
                  question={`Da li ste sigurni da želite da obrišete korisnika $ ${selectedUser?.firstName} ${selectedUser?.lastName} - ${selectedUser?.email}?`}
                />
              )}

              {selectedUser && showModalEditUser && <ModalEditUser setShowModalEditUser={setShowModalEditUser} selectedUser={selectedUser} setSelectedUser={setSelectedUser} fetchData={fetchData} />}
            </div>
          </div>
        </div>
      ) : (
        !showSpinner && <p className="p-3">Nema korisnika u bazi...</p>
      )}
      {showSpinner && <Spinner />}
    </>
  );
};

export default Dashboard;
