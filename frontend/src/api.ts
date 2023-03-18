export type Stat = {
  player: {
    uuid: string;
    nickname: string;
  };
  value: number;
};

export const getStats = async (params: {
  group: string;
  stat: string;
  page?: number;
}) => {
  const searchParams = new URLSearchParams();
  for (const [key, value] of Object.entries(params))
    searchParams.append(key, value.toString());
  return fetch(`/api/stats?${searchParams.toString()}`).then(res =>
    res.json()
  ) as Promise<Stat[]>;
};
