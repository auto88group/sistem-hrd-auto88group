import api from "../axios";

export interface TrainingCertificateSelectedParams {
  user_id?: string;
}
export interface TrainingCertificateCreateUpdateParams {
  // required
  user_id: number;
  certificate_name: string;
  organizer: string;
  issue_date: string;
  expiry_date: string;
  notes: string;
  attachment: File;
}
export interface TrainingCertificateSelectedResponse {
  success: boolean;
  data: TrainingCertificate[];
}
export interface TrainingCertificateCreateUpdateResponse {
  success: boolean;
  message: string;
  data: TrainingCertificate;
}
export interface TrainingCertificateDestroyResponse {
  success: boolean;
  message: string;
}

export interface TrainingCertificate {
  id: number;
  user_id: number;
  certificate_name: string;
  organizer: string;
  issue_date: string;
  expiry_date: string;
  notes: string;
  attachment: File;
}

export const trainingCertificateApi = {
  getSelected(
    params: TrainingCertificateSelectedParams,
  ): Promise<TrainingCertificateSelectedResponse> {
    return api
      .get(`/hrd/training-certificate/${params.user_id}`)
      .then((res) => res.data);
  },
  updateTrainingCertificate(
    id: number,
    params: FormData,
  ): Promise<TrainingCertificateCreateUpdateResponse> {
    return api
      .post(`/hrd/training-certificate/${id}`, params, {
        headers: { "Content-Type": "multipart/form-data" },
        transformRequest: [(data) => data],
      })
      .then((res) => res.data);
  },
  createTrainingCertificate(
    params: FormData,
  ): Promise<TrainingCertificateCreateUpdateResponse> {
    return api
      .post(`/hrd/training-certificate`, params, {
        headers: { "Content-Type": "multipart/form-data" },
        transformRequest: [(data) => data],
      })
      .then((res) => res.data);
  },
  destroyTrainingCertificate(
    id: number,
  ): Promise<TrainingCertificateDestroyResponse> {
    return api
      .delete(`/hrd/training-certificate/${id}`)
      .then((res) => res.data);
  },
};
