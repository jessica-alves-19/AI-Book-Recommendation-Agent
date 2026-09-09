interface BookCardProps {
  title: string;
  authors: string[];
  publishedDate?: string;
  thumbnail?: string;
}

export function BookCard({
  title,
  authors,
  publishedDate,
  thumbnail,
}: BookCardProps) {
  return (
    <article className="recommendation-card">
      <div className="recommendation-card__cover">
        {thumbnail ? (
          <img
            src={thumbnail}
            alt={`Cover of ${title}`}
          />
        ) : (
          <div className="recommendation-card__no-cover">
            No cover
          </div>
        )}
      </div>

      <div className="recommendation-card__content">
        <h2>{title}</h2>

        <p className="recommendation-card__author">
          {authors.length > 0
            ? authors.join(", ")
            : "Unknown author"}
        </p>

        <div className="recommendation-card__info">
          <div className="recommendation-card__info-box">
            <span>Published</span>
            <strong>{publishedDate ?? "Unknown"}</strong>
          </div>


        </div>
      </div>
    </article>
  );
}