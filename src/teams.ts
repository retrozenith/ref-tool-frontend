/**
 * Teams List - AJF ILFOV
 * Updated: 2025-10-17
 * Format: One team per line, ALL CAPS, sorted alphabetically
 */

export const TEAMS_LIST: string[] = [
  // A.S. teams
  "A.S. SPORTING O.L.",
  "A.S. SPORTING O.L. 2019",
  "A.S. STEJARUL GRUIU",
  "A.S.C.V. MOARA VLASIEI",
  "A.S. NEW CASTLE",
  "A.S. PESCARUSUL GRADISTEA",
  "A.S. RADU",
  "A.S. RADUCS MAGURELE",
  "A.S. VOINTA BRANESTI",
  "A.S. YOUNG BOYS PETRACHIOAIA",

  // ACS teams
  "A.C.S. ACADEMICA",
  "A.C.S. ACADEMICA DOMNESTI",
  "A.C.S. ARGMAN",
  "A.C.S. ATHELTICO YOUNG STAR",
  "A.C.S. ATLETIC BUFTEA",
  "A.C.S. DE SANATATE",
  "A.C.S. DE SANATATE VOINTA BUFTEA",
  "A.C.S. FULGERUL",
  "A.C.S. GLINA",
  "A.C.S. JUNIORS BERCENI",
  "A.C.S. LPS HD CLINCENI",
  "A.C.S. LPS HD CLINCENI 2",
  "A.C.S. MAO RADULESCO",
  "A.C.S. OLIMPIC SNAGOV",
  "A.C.S. OLIMPIC SNAGOV 2",
  "A.C.S. PERIS",
  "A.C.S. REAL BRAGADIRU",
  "A.C.S. REAL BRAGADIRU 2",
  "A.C.S. SABRI ARENA",
  "A.C.S. SABRI ARENA 2",
  "A.C.S. UNIREA DOBROESTI",
  "A.C.S. UNIREA DOBROESTI 2",
  "A.C.S. VIITORUL CORBEANCA",
  "A.C.S. VIITORUL DRAGOMIRESTI VALE",
  "A.C.S. VIITORUL MOARA VLASIEI",
  "A.C.S. VIITORUL VIDRA",
  "A.C.S. VOINTA DOMNESTI",
  "A.C.S. YOUNG BOYS PETRACHIOAIA",

  // ACSL teams
  "A.C.S.L. STEFANESTI",

  // ACSO teams
  "A.C.S.O. VIITORUL PANTELIMON",

  // ACSS teams
  "A.C.S.S. VOINTA BUFTEA",
  "A.C.S.S. VOINTA BUFTEA 2",

  // ASCC teams
  "A.S.C.C. CIOLPANI",

  // CS teams
  "C.S. AFUMATI",
  "C.S. BALOTESTI",
  "C.S. BALOTESTI 2",
  "C.S. BRANESTI",
  "C.S. CERNICA",
  "C.S. CERNICA 2",
  "C.S. CHITILA",
  "C.S. CIOROGARLA",
  "C.S. CONCORDIA CHIAJNA",
  "C.S. DARASTI",
  "C.S. GLORIA BURIAS",
  "C.S. GLINA",
  "C.S. MAGURELE",
  "C.S. MILANETO",
  "C.S. OTOPENI",
  "C.S. PROGRESUL MOGOSOAIA",
  "C.S. PROGRESUL MOGOSOAIA 2",
  "C.S. TUNARI",
  "C.S. TUNARI 2",
  "C.S. TUNARI 3",
  "C.S. VOINTA DOMNESTI",
  "C.S. VOINTA DOMNESTI 2",

  // C.S.L. teams
  "C.S.L. STEFANESTI",

  // F.C. teams
  "F.C. VOLUNTARI",
  "F.C. VOLUNTARI 2",
  "F.C. VOLUNTARI S.A.",
  "F.C. VOLUNTARI 2 S.A.",
  "F.C. 1 DECEMBRIE",

  // S.C. teams
  "S.C. POPESTI LEORDENI",

  // Other teams
  "FRATIA",
  "SPORTING O.L.",
];

/**
 * Filter teams based on search query
 * @param query - The search string
 * @returns Array of matching team names
 */
export function filterTeams(query: string): string[] {
  if (!query || query.trim() === '') {
    return TEAMS_LIST;
  }

  const normalizedQuery = query.toUpperCase().trim();
  
  return TEAMS_LIST.filter(team => 
    team.toUpperCase().includes(normalizedQuery)
  );
}
