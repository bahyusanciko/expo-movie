import { HeadTitleProps } from "@/data/types";
import React from "react";
import { Helmet } from "react-helmet";

const HeadTitle = ({ title, description }: HeadTitleProps) => {
  return (
    <Helmet>
      <title>{title}</title>
      {description && <meta name="description" content={description} />}
    </Helmet>
  );
};

export default HeadTitle;
