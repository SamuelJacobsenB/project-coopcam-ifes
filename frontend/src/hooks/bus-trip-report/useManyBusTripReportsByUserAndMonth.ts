import { useMutation } from "@tanstack/react-query";

import { api } from "../../services";
import type { BusTripReport } from "../../types";

interface BusTripReportsByUserAndMonthParams {
  user_id: string;
  month: number;
}

export const fetchManyBusTripReportsByUserAndMonth = async ({
  user_id,
  month,
}: BusTripReportsByUserAndMonthParams): Promise<BusTripReport[]> => {
  const res = await api.get<BusTripReport[]>(
    `/v1/bus-trip-report/user/${user_id}/month/${month}/`,
  );

  if (res.code !== "SUCCESS") {
    throw new Error(res.message || "Erro ao buscar relatórios");
  }

  return res.data;
};

export const useManyBusTripReportsByUserAndMonth = () => {
  const { mutateAsync: getManyBusTripReportsByUserAndMonth } = useMutation({
    mutationFn: (params: BusTripReportsByUserAndMonthParams) =>
      fetchManyBusTripReportsByUserAndMonth(params),
    retry: false,
  });

  return { getManyBusTripReportsByUserAndMonth };
};
