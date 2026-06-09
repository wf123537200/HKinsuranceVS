export default function Disclaimer({ compact = false }: { compact?: boolean }) {
  if (compact) {
    return (
      <p className="text-xs text-gray-500 leading-relaxed">
        InsuranceAtlas does not sell insurance products or provide personalized insurance advice.
        All information is for research and educational purposes only.
      </p>
    );
  }

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
      <p className="text-sm text-gray-600 leading-relaxed">
        <strong>Disclaimer:</strong> InsuranceAtlas does not sell insurance products and does not
        provide personalized insurance, financial, or investment advice. All information is provided
        for research and educational purposes only. Product details should be verified against
        official brochures, policy documents, and licensed professionals.
      </p>
    </div>
  );
}
