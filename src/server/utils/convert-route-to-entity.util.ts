const mapping: Record<string, string> = {
  'data-structures': 'data_structure',
  'extracted-data': 'extracted_data',
  organizations: 'organization',
  'pdf-files': 'pdf_file',
  users: 'user',
};

export function convertRouteToEntityUtil(route: string) {
  return mapping[route] || route;
}
