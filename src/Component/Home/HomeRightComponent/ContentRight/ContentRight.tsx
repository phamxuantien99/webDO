import { CSSProperties, useContext, useEffect, useRef, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { BsEyeFill, BsPenFill } from "react-icons/bs";
import { RiDeleteBin6Line } from "react-icons/ri";
import { Link, useNavigate } from "react-router-dom";
import { FadeLoader } from "react-spinners";
import AuthContext, { AuthContextType } from "../../../context/AuthProvider";
import { api } from "../../../service/api/endpoint";
import {
  axiosInstance,
  axiosInstanceV2,
} from "../../../service/hooks/axiosInstance";
import { useQueryClient } from "@tanstack/react-query";

const override: CSSProperties = {
  display: "flex",
  margin: "300px auto",
  borderColor: "red",
};

const header = [
  "Created At",
  "Delivery Order Ref",
  "Internal",
  "External",
  "Project Code",
  "Company",
  "Contact Person",
  "Contact Number",
  "Mode of Delivery",
  "Client Ref",
  "Remark",
];

const ContentRight = () => {
  const {
    auth,
    dataAnalysis,
    isLoadingData,
    setSearchQuery,
    setCurrentPage,
    currentPage,
    selectedAnalysis,
  } = useContext(AuthContext) as AuthContextType;
  const url = auth ? `Bearer ${auth}` : "";
  const headers = {
    Authorization: url,
    accept: "application/json",
    "Content-Type": "application/json",
  };

  const queryClient = useQueryClient();

  const getRoleAdmin = localStorage.getItem("authUser");

  const [invoiceProjectCodeOptions, setInvoiceProjectCodeOptions] = useState<
    string[]
  >([]);

  const handleSearch = (value: string) => {
    setSearchQuery(value);
  };

  const totalPages = Math.ceil(dataAnalysis?.search_options?.total_count / 20);

  useEffect(() => {
    if (dataAnalysis?.founds) {
      const projectCode = dataAnalysis?.founds
        .map((item: any) => item["project_code"])
        .filter(
          (item: any, i: any, ar: string | any[]) => ar.indexOf(item) === i
        )
        .sort();

      setInvoiceProjectCodeOptions(projectCode);
    }
  }, [dataAnalysis?.founds]);

  const [updating, setUpdating] = useState<boolean>(false);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const [editDate, setEditDate] = useState<any>(new Date());
  const [idInvoice, setIdInvoice] = useState<number>(0);

  const [edit, setEdit] = useState<any>({
    contact_person: "",
    contact_number: "",
    your_ref: "",
  });
  const defaultEdit = {
    contact_person: "",
    contact_number: "",
    your_ref: "",
  };

  const editItem = (item: any) => {
    const dateSplit = item["created_at"].split("/");
    const date = `${dateSplit[2]}-${dateSplit[1]}-${dateSplit[0]}`;
    setEditDate(new Date(date));
    setIdInvoice(item["invoice_id"]);
    const payload = {
      contact_person: item["contact_person"],
      contact_number: item["contact_number"],
      your_ref: item["client_ref"],
    };

    setEdit(Object.assign({}, payload));
  };

  const _handleUpdateInvoiceForm = () => {
    document.getElementById("close")?.click();
    setEdit(defaultEdit);
  };

  const updateInvoiceFormRef = useRef(null);

  const _handleUpdateInvoice = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setUpdating(true);

    const payload = edit;

    axiosInstance
      .put(api.putBaseLogisticInvoice(idInvoice), payload)
      .then((res) => {
        console.log(res);
        _handleUpdateInvoiceForm();
        // refetchDataList();
      })
      .catch((e) => {
        console.log(e);
      })
      .finally(() => setUpdating(false));
  };

  const [isLoadingDelete, setIsLoadingDelete] = useState<boolean>(false);

  const handleDeleteInvoice = async (id: number, project: string) => {
    console.log({ id, project });
    setIsLoadingDelete(true);
    try {
      const response = await axiosInstanceV2.put(
        api.deleteInvoiceProject(id, project)
      );
      console.log("Delete successful:", response.data);

      // Gọi lại dữ liệu mới
      // refetchDataList();

      queryClient.invalidateQueries({ queryKey: ["dataLogisticDelivered"] });
      queryClient.invalidateQueries({ queryKey: ["dataLogisticOngoing"] });
      // Thông báo kết quả thành công nếu cần
      // showToast("Invoice deleted successfully!", "success");
    } catch (error: unknown) {
      console.error("Error deleting invoice:", error);
    } finally {
      setIsLoadingDelete(false);
    }
  };

  const renderUpdateModal = (item: any) => {
    return (
      <div>
        <label
          onClick={() => editItem(item)}
          htmlFor="modal-edit"
          className="btn modal-button btn-square btn-sm"
        >
          <BsPenFill size={16} />
        </label>
        <input type="checkbox" id="modal-edit" className="modal-toggle" />
        <div className="modal">
          <div className="modal-box relative">
            <label
              id="close"
              htmlFor="modal-edit"
              className="btn btn-sm btn-circle absolute right-2 top-2"
            >
              ✕
            </label>
            <h3 className="text-lg font-bold mb-10">Update PDO</h3>
            <div>
              <form
                ref={updateInvoiceFormRef}
                onSubmit={(e) => _handleUpdateInvoice(e)}
              >
                <div className="grid gap-3">
                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      Generate Date
                    </label>
                    <DatePicker
                      className="input input-bordered w-full"
                      selected={editDate}
                      onChange={(date) =>
                        setEdit((prev: any) => ({
                          ...prev,
                          date: date,
                        }))
                      }
                      disabled={true}
                      placeholderText="dd/mm/yyyy"
                      dateFormat="dd/MM/yyyy"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      Contact Person
                    </label>
                    <input
                      required
                      value={edit.contact_person}
                      onChange={(event) =>
                        setEdit((prev: any) => ({
                          ...prev,
                          contact_person: event.target.value,
                        }))
                      }
                      type="text"
                      placeholder="Contact person"
                      className="input input-bordered w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      Contact Number
                    </label>
                    <input
                      required
                      value={edit.contact_number}
                      onChange={(event) =>
                        setEdit((prev: any) => ({
                          ...prev,
                          contact_number: event.target.value,
                        }))
                      }
                      type="text"
                      placeholder="Contact number"
                      className="input input-bordered w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      Client Ref
                    </label>
                    <input
                      required
                      value={edit.your_ref}
                      onChange={(event) =>
                        setEdit((prev: any) => ({
                          ...prev,
                          your_ref: event.target.value,
                        }))
                      }
                      type="text"
                      placeholder="Client Ref"
                      className="input input-bordered w-full"
                    />
                  </div>

                  <button
                    type="submit"
                    className={`btn btn-primary ${updating && "loading"}`}
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const [isLoadingCheckbox, setIsLoadingCheckbox] = useState(false);
  const [checkbox, setCheckbox] = useState<any>({});

  const handleTickerCheckbox = async (id: number) => {
    try {
      setIsLoadingCheckbox(true); // Bật loading
      setCheckbox((prev: any) => ({ ...prev, [id]: true }));
      await axiosInstanceV2.put(api.putTickerLogisticInvoice(id));
    } catch (error) {
      console.error(error);
      alert("Failed to update ticker, please contact administrator");
      setCheckbox((prev: any) => ({ ...prev, [id]: false }));
    } finally {
      setIsLoadingCheckbox(false); // Tắt loading
    }
  };

  const navigate = useNavigate();

  return (
    <div className="mx-[auto] w-full">
      {(isLoadingCheckbox || isLoadingDelete) && (
        <div style={styles.overlay}>
          <div style={styles.loader}></div>
        </div>
      )}
      <div
        className="overflow-y-auto "
        style={{ height: "calc(100vh - 200px)" }}
      >
        <table className="table w-full">
          <thead>
            <tr>
              <th className="border border-gray-300 px-4 py-2 text-center">
                No.
              </th>
              <th className="border border-gray-300 px-4 py-2 text-center">
                Action
              </th>
              {header.map((item, index) =>
                item === "Internal" ? (
                  <th
                    key={index}
                    colSpan={3}
                    className="border border-gray-300 px-4 py-2 text-center"
                  >
                    {item}
                  </th>
                ) : (
                  <th
                    key={index}
                    className="border border-gray-300 px-4 py-2 text-center"
                  >
                    {item}
                  </th>
                )
              )}
            </tr>
            <tr>
              <th className="border border-gray-300 px-4 py-2 text-center"></th>
              <th className="border border-gray-300 px-4 py-2 text-center"></th>
              {header.map((item, index) => {
                if (item === "Internal") {
                  return ["Logistic Personal", "Driver", "Supervisor"].map(
                    (subItem, subIndex) => (
                      <th
                        key={`${index}-${subIndex}`}
                        className="border border-gray-300 px-4 py-2 text-center w-1/3"
                      >
                        {subItem}
                      </th>
                    )
                  );
                }

                if (item === "External") {
                  return (
                    <th
                      key={index}
                      className="border border-gray-300 px-4 py-2 text-center"
                    >
                      Client
                    </th>
                  );
                }

                return (
                  <th
                    key={index}
                    className="border border-gray-300 px-4 py-2 text-center"
                  ></th>
                );
              })}
            </tr>

            <tr>
              <td colSpan={15}>
                <input
                  type="text"
                  placeholder="Search..."
                  onChange={(event) => handleSearch(event.target.value)}
                  className="input input-bordered w-full"
                ></input>
              </td>
            </tr>
          </thead>

          <tbody className="w-full">
            {dataAnalysis?.founds?.map((item: any, index: any) => {
              return (
                <tr key={index} className="hover">
                  <th>{item["invoice_id"]}</th>
                  <td key={"action"}>
                    <div className="flex gap-3 items-center">
                      <div className="p-4">
                        {/* Checkbox */}
                        <div className="flex items-center flex-col">
                          <input
                            type="checkbox"
                            id={`checkbox-${item["invoice_id"]}`}
                            checked={
                              item["ticker"] === "T" ||
                              checkbox[item["invoice_id"]]
                                ? true
                                : false
                            }
                            onChange={() =>
                              handleTickerCheckbox(item["invoice_id"])
                            }
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                            disabled={
                              (item["ticker"] === "T" ? true : false) ||
                              checkbox[item["invoice_id"]]
                            }
                          />
                        </div>
                      </div>

                      {/* <Link
                        to={`/home/${item["invoice_id"]}`}
                        className="btn btn-square btn-outline btn-sm"
                      >
                        <BsEyeFill size={16} />
                      </Link> */}

                      <button
                        onClick={() => {
                          navigate(`/home/${item["invoice_id"]}`);
                        }}
                        className={`btn btn-square btn-outline btn-sm }`}
                        disabled={
                          item["loading_sign"] !== null ||
                          item["unload_sign"] !== null
                            ? true
                            : false
                        }
                      >
                        <BsEyeFill size={16} />
                      </button>

                      <button
                        onClick={() =>
                          handleDeleteInvoice(
                            item["invoice_id"],
                            item["project_code"]
                          )
                        }
                        className={`btn btn-square btn-outline btn-sm }`}
                        disabled={
                          item["loading_sign"] !== null ||
                          item["unload_sign"] !== null
                            ? true
                            : false
                        }
                      >
                        <RiDeleteBin6Line size={16} />
                      </button>

                      {getRoleAdmin && <>{renderUpdateModal(item)}</>}
                    </div>
                  </td>

                  <td>{item["created_at"]}</td>
                  <td>{item["delivery_order_ref"]}</td>

                  {/* loading */}

                  {item["loading_sign"] === null ? (
                    <td className="text-red-500 text-left">
                      Not signed{" "}
                      <span>
                        <Link
                          to={`/home/${
                            item["invoice_id"]
                          }?param=${"Logistic Personal"}`}
                          className="btn btn-square btn-outline btn-sm"
                        >
                          <BsEyeFill size={16} />
                        </Link>
                      </span>
                    </td>
                  ) : (
                    <td className="text-green-500 text-center">
                      Signed{" "}
                      <span>
                        <Link
                          to={`/home/${
                            item["invoice_id"]
                          }?param=${"Logistic Personal"}`}
                          className="btn btn-square btn-outline btn-sm"
                        >
                          <BsEyeFill size={16} />
                        </Link>
                      </span>
                    </td>
                  )}

                  {/* driver */}

                  {item["driver_sign"] === null ? (
                    <td className="text-red-500 text-left">
                      Not signed{" "}
                      <span>
                        <Link
                          to={`/home/${item["invoice_id"]}?param=${"Driver"}`}
                          className="btn btn-square btn-outline btn-sm"
                        >
                          <BsEyeFill size={16} />
                        </Link>
                      </span>
                    </td>
                  ) : (
                    <td className="text-green-500 text-center">
                      Signed{" "}
                      <span>
                        <Link
                          to={`/home/${item["invoice_id"]}?param=${"Driver"}`}
                          className="btn btn-square btn-outline btn-sm"
                        >
                          <BsEyeFill size={16} />
                        </Link>
                      </span>
                    </td>
                  )}

                  {/* supervisor */}

                  {item["unload_sign"] === null ? (
                    <td className="text-red-500 text-left">
                      Not signed{" "}
                      <span>
                        <Link
                          to={`/home/${
                            item["invoice_id"]
                          }?param=${"Supervisor"}`}
                          className="btn btn-square btn-outline btn-sm"
                        >
                          <BsEyeFill size={16} />
                        </Link>
                      </span>
                    </td>
                  ) : (
                    <td className="text-green-500 text-center">
                      Signed{" "}
                      <span>
                        <Link
                          to={`/home/${
                            item["invoice_id"]
                          }?param=${"Supervisor"}`}
                          className="btn btn-square btn-outline btn-sm"
                        >
                          <BsEyeFill size={16} />
                        </Link>
                      </span>
                    </td>
                  )}

                  {/* client */}

                  {item["client_sign"] === null ? (
                    <td className="text-red-500 text-left">
                      Not signed{" "}
                      <span>
                        <Link
                          to={`/home/${item["invoice_id"]}?param=${"Client"}`}
                          className="btn btn-square btn-outline btn-sm"
                        >
                          <BsEyeFill size={16} />
                        </Link>
                      </span>
                    </td>
                  ) : (
                    <td className="text-green-500 text-center">
                      Signed{" "}
                      <span>
                        <Link
                          to={`/home/${item["invoice_id"]}?param=${"Client"}`}
                          className="btn btn-square btn-outline btn-sm"
                        >
                          <BsEyeFill size={16} />
                        </Link>
                      </span>
                    </td>
                  )}

                  <td>{item["project_code"]}</td>
                  <td>{item["company"]}</td>
                  <td>{item["contact_person"]}</td>
                  <td>{item["contact_number"]}</td>
                  <td>{item["driver"]}</td>
                  <td>{item["client_ref"]}</td>
                  <td>{item["remark"]}</td>
                </tr>
              );
            })}
            <tr>
              {!isLoadingData &&
                (dataAnalysis?.founds?.length === 0 ||
                  dataAnalysis?.list_component?.length === 0) && (
                  <td colSpan={header.length + 2} className={"text-center"}>
                    No results
                  </td>
                )}
              {isLoadingData && (
                <td colSpan={header.length + 2} className={"text-center"}>
                  <FadeLoader
                    loading={isLoadingData}
                    cssOverride={override}
                    color="red"
                    aria-label="Loading Spinner"
                    data-testid="loader"
                  />
                </td>
              )}
            </tr>
          </tbody>
        </table>
      </div>
      <div className="flex bg-white rounded-lg font-[Poppins] align-center items-center">
        <button
          disabled={currentPage === 1}
          onClick={() => handlePageChange((currentPage as number) - 1)}
          className="h-12 border-2 border-r-0 border-indigo-600
               px-4 rounded-l-lg hover:bg-indigo-600 hover:text-white"
        >
          <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
            <path
              d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
              clip-rule="evenodd"
              fill-rule="evenodd"
            ></path>
          </svg>
        </button>
        <p className="font-bold mx-2">{`Page ${currentPage} of ${totalPages}`}</p>
        <button
          onClick={() => handlePageChange((currentPage as number) + 1)}
          disabled={currentPage === totalPages}
          className="h-12 border-2  border-indigo-600
               px-4 rounded-r-lg hover:bg-indigo-600 hover:text-white"
        >
          <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
            <path
              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
              clip-rule="evenodd"
              fill-rule="evenodd"
            ></path>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ContentRight;

const styles = {
  overlay: {
    position: "fixed" as "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  },
  loader: {
    width: "50px",
    height: "50px",
    border: "5px solid #f3f3f3",
    borderRadius: "50%",
    borderTop: "5px solid #3498db",
    animation: "spin 1s linear infinite",
  },
};
