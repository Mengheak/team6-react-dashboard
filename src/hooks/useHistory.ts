import { useEffect, useRef } from "react";

const useHistory = (value: number, max = 30) => {
  const history = useRef<number[]>([]);
  useEffect(() => {
    history.current = [...history.current.slice(-(max - 1)), value];
  }, [value, max]);
  return history.current;
};

export default useHistory;
