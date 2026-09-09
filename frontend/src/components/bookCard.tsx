interface BookCardProps {
  title: string;
  authors: string[];
  description?: string;
  thumbnail?: string;
  publishedDate?: string;
}

export function BookCard({
  title,
  authors,
  description,
  thumbnail,
  publishedDate,
}: BookCardProps) {
  return (
    <article>
      {thumbnail && <img src={thumbnail} alt={`Cover of ${title}`} />}

      <h2>{title}</h2>

      <p>{authors.join(", ")}</p>

      {publishedDate && <p>Published: {publishedDate}</p>}

      {description && <p>{description}</p>}
    </article>
  );
}
