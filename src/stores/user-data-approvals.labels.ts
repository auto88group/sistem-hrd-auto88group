// entity_type -> teks yang tampil di card dan tabel approval
export const ENTITY_LABELS: Record<string, string> = {
  hrd_families: "Keluarga",
  hrd_education: "Pendidikan",
  hrd_work_experience: "Pengalaman Kerja", // TODO: cek entity_type aslinya
  hrd_training_certificates: "Sertifikat Pelatihan",
  hrd_file_completenesses: "Kelengkapan Berkas",
};

// Gabungkan item sejenis, mis. 3 item berkas -> "Kelengkapan Berkas (3)"
export function buildLabels(items: { entity_type: string }[] = []): string[] {
  const count = new Map<string, number>();
  items.forEach((i) =>
    count.set(i.entity_type, (count.get(i.entity_type) ?? 0) + 1),
  );

  return Array.from(count, ([type, n]) => {
    const name = ENTITY_LABELS[type] ?? type;
    return n > 1 ? `${name} (${n})` : name;
  });
}
