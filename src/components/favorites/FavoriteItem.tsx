export default function FavoriteItem({
  title,
  creator,
  note,
}: {
  title: string;
  creator: string;
  note?: string;
}) {
  return (
    <div className="flex gap-3 py-3 border-b border-border last:border-0">
      <div className="flex-1 min-w-0">
        <p className="font-medium text-foreground truncate">{title}</p>
        <p className="text-sm text-muted">{creator}</p>
        {note && <p className="text-xs text-faint mt-0.5 italic">{note}</p>}
      </div>
    </div>
  );
}
