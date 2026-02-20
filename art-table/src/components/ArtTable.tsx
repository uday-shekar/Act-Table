import { useEffect, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { fetchArtworks } from '../api/artworksApi';
import type { Artwork } from '../types/artwork';

const ROWS_PER_PAGE = 12;

const ArtTable = () => {
  // 📄 current page data ONLY
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [page, setPage] = useState<number>(1);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  // 🔑 persistent selection (store ONLY IDs)
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

  // 📡 server-side pagination fetch
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const response = await fetchArtworks(page, ROWS_PER_PAGE);
        setArtworks(response.data);
        setTotalRecords(response.pagination.total);
      } catch (error) {
        console.error('Failed to fetch artworks', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [page]);

  // ✅ selected rows ONLY for current page
  const selectedRows = artworks.filter(art =>
    selectedIds.has(art.id)
  );

  // 📄 paginator handler (SERVER-SIDE)
  const onPageChange = (event: any) => {
    const nextPage =
      Math.floor(event.first / event.rows) + 1;
    setPage(nextPage);
  };

  // ☑️ selection handler (persistent across pages)
  const onSelectionChange = (event: { value: Artwork[] }) => {
    setSelectedIds(prev => {
      const updated = new Set(prev);

      // ❌ remove current page IDs
      artworks.forEach(art => updated.delete(art.id));

      // ✅ add newly selected IDs
      event.value.forEach(art => updated.add(art.id));

      return updated;
    });
  };

  return (
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
      showGridlines
      responsiveLayout="scroll"
    >
      <Column selectionMode="multiple" headerStyle={{ width: '3rem' }} />
      <Column field="title" header="TITLE" />
      <Column field="place_of_origin" header="PLACE OF ORIGIN" />
      <Column field="artist_display" header="ARTIST" />
      <Column field="inscriptions" header="INSCRIPTIONS" />
      <Column field="date_start" header="START DATE" />
      <Column field="date_end" header="END DATE" />
    </DataTable>
  );
};

export default ArtTable;