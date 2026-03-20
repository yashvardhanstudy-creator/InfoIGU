import ShowGeneric from "./ShowGeneric";

export default function ShowResearch({ id, heading, headingId, editMode }: { id: number; heading?: string; headingId?: string; editMode?: boolean; }) {
  // Graceful fallback if ID is missing or not loaded yet
  if (!id) {
    return <div className="text-center p-4">Loading...</div>;
  }

  // ShowGeneric handles empty data automatically by rendering table headers
  // so you can still click "Add" to insert your very first row!
  return (
    <ShowGeneric
      id={id}
      endpoint="projects"
      heading={heading}
      headingId={headingId}
      editMode={editMode}
      columns={[
        { key: "topic", label: "Topic", required: true },
        { key: "start_date", label: "Start Date" },
        { key: "field", label: "Field" },
        { key: "financial_outlay", label: "Financial Outlay" },
        { key: "funding_agency", label: "Funding Agency" },
        { key: "other_officers", label: "Other Officers" },
        { key: "url", label: "URL" } // ShowGeneric will handle this natively!
      ]}
    />
  );
}
