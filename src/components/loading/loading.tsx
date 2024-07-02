"use client";
import { RootState } from "@/redux/store";
import { loading } from "@/theme/colors";
import React, { useEffect, useState } from "react";
import ReactLoading from "react-loading";
import { useSelector } from "react-redux";

const Loading: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const data = useSelector((state: RootState) => state.loading.data);

  useEffect(() => {
    if (data.isLoading !== null) {
      setIsLoading(data.isLoading);
      document.body.style.opacity = data.isLoading ? "0.6" : "1";
    }
  }, [data.isLoading]);

  return isLoading ? (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "fixed",
        zIndex: 20000,
      }}
    >
      <ReactLoading type="spin" height={200} width={100} color={loading.main} />
    </div>
  ) : null;
};

export default Loading;
