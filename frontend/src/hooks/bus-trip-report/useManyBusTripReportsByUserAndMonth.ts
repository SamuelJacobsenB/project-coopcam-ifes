import { useMutation } from "@tanstack/react-query";

import { api } from "../../services";
import type { BusTripReport } from "../../types";

interface Data {
  user_id: string;
  month: number;
}

export const fetchManyBusTripReportsByUserAndMonth = async ({
  user_id,
  month,
}: Data) => {
  try {
    const res = await api.get<BusTripReport[]>(
      `/v1/bus-trip-report/user/${user_id}/month/${month}/`,
    );

    if (res.status !== 200) throw new Error("Erro ao buscar relatórios");

    return res.data;
  } catch {
    throw new Error("Erro ao buscar relatórios");
  }
};

export const useManyBusTripReportsByUserAndMonth = () => {
  const { mutateAsync: getManyBusTripReportsByUserAndMonth } = useMutation({
    mutationFn: ({ user_id, month }: Data) =>
      fetchManyBusTripReportsByUserAndMonth({
        user_id,
        month,
      }),
  });

  return { getManyBusTripReportsByUserAndMonth };
};
