export type Movie = {
  title: string;
  poster: string;
  year: string;
};


export type CardMovieProps = {
  item: {
    title: string;
    poster: string;
    year: string;
  };
  cardWidth: number;
};

export type HeadTitleProps = {
  title: string;
  description?: string;
};
