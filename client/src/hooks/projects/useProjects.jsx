import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getProjects } from "../../redux/projects/projectThunks";

export const useProjects = () => {
  const dispatch = useDispatch();
  const { projects, loading, error } = useSelector((state) => state.project);

  useEffect(() => {
    dispatch(getProjects());
  }, [dispatch]);

  return { projects, loading, error };
};
