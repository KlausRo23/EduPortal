export function buildSummary(records) {
  const summary = {
    midterm: { present: 0, absent: 0, late: 0, excused: 0, total: 0 },
    finals:  { present: 0, absent: 0, late: 0, excused: 0, total: 0 },
  };

  for (const record of records) {
    const bucket = summary[record.period];
    if (!bucket) continue;
    bucket[record.status.toLowerCase()]++;
    bucket.total++;
  }

  return summary;
}

export function isAbsent(status) {
  return status === "Absent";
}