import Image from "next/image";

export default function SortControl({ sortOrder, onToggleSortOrder }) {
  return (
    <button onClick={onToggleSortOrder}>
      <Image
        src={
          sortOrder === "desc"
            ? "/images/sort-numeric-down.svg"
            : "/images/sort-numeric-up.svg"
        }
        alt={sortOrder === "desc" ? "Descending Order" : "Ascending Order"}
        width={15}
        height={15}
      ></Image>
    </button>
  );
}
