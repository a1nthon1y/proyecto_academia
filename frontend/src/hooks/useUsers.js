import { useQuery } from "@tanstack/react-query";
import { getUsers } from "@/services/userService";

export const useUsers = () => {
  const {isLoading, data, isError, isFetching, refetch } = useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
  });

  return {
    data,
    isLoading,
    isError,
    isFetching,
    refetch,
  };
};