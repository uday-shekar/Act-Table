import { useEffect, useState, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { fetchArtworks } from "../api/artworksApi";
import type { Artwork } from "../types/artwork";
import HeaderSelectPopup from "./HeaderSelectPopup";

const ROWS_PER_PAGE = 12;

const ArtTable = () => {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [page, setPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState(false);

  /*Persistent selection (IDS only) */
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

  /*Target count (NO prefetching) */
  const [targetSelectCount, setTargetSelectCount] = useState<number | null>(null);

  const iconRef = useRef<HTMLDivElement | null>(null);
  const [showPopup, setShowPopup] = useState(false);

  /* SERVER SIDE PAGINATION*/
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const res = await fetchArtworks(page, ROWS_PER_PAGE);
      setArtworks(res.data);
      setTotalRecords(res.pagination.total);
      setLoading(false);
    };
    load();
  }, [page]);

  /* AUTO SELECT (SAFE)*/
  useEffect(() => {
    if (!targetSelectCount) return;
    if (selectedIds.size >= targetSelectCount) {
      setTargetSelectCount(null);
      return;
    }

    setSelectedIds(prev => {
      const next = new Set(prev);

      for (const row of artworks) {
        if (next.size >= targetSelectCount) break;
        next.add(row.id);
      }

      return next;
    });
  }, [artworks, targetSelectCount]);

  /*PAGE SAFE SELECTION*/
  const selectedRows = artworks.filter(a => selectedIds.has(a.id));

  const onSelectionChange = (e: any) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      artworks.forEach(a => next.delete(a.id));
      e.value.forEach((a: Artwork) => next.add(a.id));
      return next;
    });
  };

  /* SELECT N ROWS (SAFE) */
  const selectRowsAcrossPages = (count: number) => {
    setShowPopup(false);
    setTargetSelectCount(count);
  };

  const onPageChange = (e: any) => setPage(e.page + 1);

  /*ICON HEADER */
  const iconHeader = (
    <div ref={iconRef} style={{ display: "flex", justifyContent: "center" }}>
      <i
        className="pi pi-chevron-down"
        style={{ cursor: "pointer" }}
        onClick={(e) => {
          e.stopPropagation();
          setShowPopup(v => !v);
        }}
      />
      {showPopup && (
        <HeaderSelectPopup
          anchorRef={iconRef}
          onSelect={selectRowsAcrossPages}
          onClose={() => setShowPopup(false)}
        />
      )}
    </div>
  );

  const paginatorLeft = (
    <span className="p-paginator-current">
      {(page - 1) * ROWS_PER_PAGE + 1} to{" "}
      {Math.min(page * ROWS_PER_PAGE, totalRecords)} of {totalRecords} entries
    </span>
  );

  return (
    <div style={{ margin: 20 }}>
      {/* INFO OUTSIDE CARD */}
      <div style={{ marginBottom: 8, fontWeight: 500 }}>
        Selected: {selectedIds.size} rows
      </div>

      {/* TABLE CARD */}
      <div
        style={{
          border: "1px solid #ddd",
          borderRadius: 10,
          background: "#fff",
          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          overflow: "hidden",
        }}
      >
        <DataTable
          value={artworks}
          lazy
          paginator
          rows={ROWS_PER_PAGE}
          totalRecords={totalRecords}
          first={(page - 1) * ROWS_PER_PAGE}
          loading={loading}
          dataKey="id"
          selection={selectedRows}
          onSelectionChange={onSelectionChange}
          onPage={onPageChange}
          stripedRows
          paginatorLeft={paginatorLeft}
          paginatorTemplate={{
            layout: "PrevPageLink PageLinks NextPageLink",
            PrevPageLink: (options) => (
              <button
                className="p-link"
                onClick={options.onClick}
                disabled={options.disabled}
              >
                Previous
              </button>
            ),
            NextPageLink: (options) => (
              <button
                className="p-link"
                onClick={options.onClick}
                disabled={options.disabled}
              >
                Next
              </button>
            ),
          }}
        >
          <Column selectionMode="multiple" style={{ width: "3rem" }} />
          <Column header={iconHeader} style={{ width: "2.5rem" }} />
          <Column field="title" header="TITLE" />
          <Column field="place_of_origin" header="PLACE OF ORIGIN" />
          <Column field="artist_display" header="ARTIST" />
          <Column field="inscriptions" header="INSCRIPTIONS" />
          <Column field="date_start" header="START DATE" />
          <Column field="date_end" header="END DATE" />
        </DataTable>
      </div>
    </div>
  );
};

export default ArtTable;