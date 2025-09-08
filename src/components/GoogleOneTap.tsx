"use client";

import useOneTapSignin from "@/hooks/useOneTapSignin";

const GoogleOneTap = () => {
  const { isLoading: oneTapIsLoading } = useOneTapSignin({
    redirect: true,
    parentContainerId: "oneTap",
  });

  return <div id="oneTap" className="fixed top-0 right-0 z-[100]" />; // This is done with tailwind. Update with system of choice
};
export default GoogleOneTap;
