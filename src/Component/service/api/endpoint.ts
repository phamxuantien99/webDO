import { BASE_URL } from "./BaseUrl";
const BASE_URLV2 = "https://ec2api.deltatech-backend.com/api/v2";

export const api = {
  getLogin: `${BASE_URL}/auth/sign-in`,

  getDataProduct: (
    currentPage?: number,
    searchValue?: string,
    signed?: string
  ) =>
    `/logistic?page=${currentPage}&delivery_order_ref_or_company_search=${searchValue?.toUpperCase()}&signed=${signed}`,
  getDataProductDetail: (productId: number) =>
    `${BASE_URL}/logistic/${productId}`,

  getLogisticSerialNumber: `/logistic/get-serial-number`,

  getLogisticComponentByProjectCode: (project_code: string, year: string) =>
    `/logistic/get-component-by-project-code?project_code=${project_code}&year=${year}`,

  postGenInvoice: (
    year: number,
    project_code: string,
    contract_person: string,
    contact_number: string,
    driver: string,
    your_ref: string,
    remark: string,
    issue_date: string
  ) =>
    `${BASE_URL}/logistic/gen-invoice?year=${year}&project_code=${project_code}&contact_person=${contract_person}&contact_number=${contact_number}&driver=${driver}&your_ref=${your_ref}&remark=${remark}&issue_date=${issue_date}`,

  putBaseLogisticInvoice: (logistic_invoice_id: number) =>
    `${BASE_URL}/logistic/base_logistic_invoice/${logistic_invoice_id}`,

  getDataLogisticInternalOngoing: `/logistic`,

  getDataLogisticV2: (
    currentPage?: number,
    searchValue?: string,
    status?: string
  ) =>
    `/logistic?page=${currentPage}&delivery_order_ref_or_company_search=${searchValue?.toUpperCase()}&status=${status}`,

  getDataLogisticOngoingV2: (currentPage?: number, searchValue?: string) =>
    `/logistic?page=${currentPage}&delivery_order_ref_or_company_search=${searchValue?.toUpperCase()}`,

  getDataLogisticInternalDelivered: `/logistic/home?number_of_days=1000`,

  getDataDetailLogisticV2: (logistic_id: number) => `/logistic/${logistic_id}`,

  getDataLogisticAllVoicesV2: (
    currentPage?: number,
    searchValue?: string,
    status?: string
  ) =>
    `/logistic/all_invoices?page=${currentPage}&delivery_order_ref_or_company_search=${searchValue?.toUpperCase()}&status=${status}`,

  getDataLogisticAllVoicesOngoingV2: (
    currentPage?: number,
    searchValue?: string
  ) =>
    `/logistic/all_invoices?page=${currentPage}&delivery_order_ref_or_company_search=${searchValue?.toUpperCase()}`,

  putTickerLogisticInvoice: (logistic_invoice_id: number) =>
    `/logistic/ticker/${logistic_invoice_id}`,

  postGenInvoiceV21: (
    year: number,
    project_code: string,
    contract_person: string,
    contact_number: string,
    modeOfDelivery: string,
    your_ref: string,
    remark: string,
    issue_date: string
  ) =>
    `/logistic/gen_invoice?year=${year}&project_code=${project_code}&contact_person=${contract_person}&contact_number=${contact_number}&driver=${modeOfDelivery}&your_ref=${your_ref}&remark=${remark}&issue_date=${issue_date}`,

  deleteInvoiceProject: (logistic_invoice_id: number, project_code: string) =>
    `/logistic/remove?invoice_id=${logistic_invoice_id}&project_code=${project_code}`,
};
