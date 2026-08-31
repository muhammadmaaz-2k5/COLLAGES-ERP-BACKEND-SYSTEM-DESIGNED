// ============================================================================
// 📚 APEX UNIVERSITY ERP — LIBRARY & OPAC CLIENT
// ============================================================================
// Frontend REST API client for book cataloging, Dewey Decimal Classification,
// barcode circulation loans, and public OPAC discovery.
// ============================================================================

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

export interface BookCatalogItem {
  id: string;
  isbn: string;
  title: string;
  author: string;
  category: string;
  ddcCode: string;
  publisher: string;
  editionYear: number;
  shelfLocation: string;
  totalCopies: number;
  availableCopies: number;
  coverUrl?: string;
  isAvailable?: boolean;
}

export interface CirculationLoanRecord {
  id: string;
  bookId: string;
  bookTitle: string;
  isbn: string;
  copyBarcode: string;
  borrowerId: string;
  borrowerRollNo: string;
  borrowerName: string;
  borrowerType: "STUDENT" | "FACULTY";
  issueDate: string;
  dueDate: string;
  returnDate: string | null;
  status: "ACTIVE" | "OVERDUE" | "RETURNED";
  overdueDays: number;
  fineAmount: number;
  renewCount: number;
}

export interface LibraryOverviewResponse {
  metrics: {
    totalTitles: number;
    totalVolumes: number;
    checkedOutCopies: number;
    availableVolumes: number;
    overdueLoans: number;
    totalFinesAccruedPKR: number;
  };
  recentLoans: CirculationLoanRecord[];
  popularBooks: BookCatalogItem[];
}

export class LibraryAPI {
  /**
   * Fetches library metrics & overview
   */
  static async getOverview(token?: string): Promise<{ success: boolean; data: LibraryOverviewResponse }> {
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const res = await fetch(`${API_BASE_URL}/library/overview`, { headers });
    if (!res.ok) throw new Error("Failed to fetch library overview");
    return res.json();
  }

  /**
   * Fetches book catalog
   */
  static async getCatalog(
    token?: string,
    filters?: { category?: string; search?: string }
  ): Promise<{ success: boolean; data: BookCatalogItem[] }> {
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const params = new URLSearchParams();
    if (filters?.category) params.set("category", filters.category);
    if (filters?.search) params.set("search", filters.search);

    const res = await fetch(`${API_BASE_URL}/library/catalog?${params.toString()}`, { headers });
    if (!res.ok) throw new Error("Failed to fetch book catalog");
    return res.json();
  }

  /**
   * Adds a new book title to the catalog
   */
  static async addBookTitle(token: string | undefined, payload: any): Promise<{ success: boolean; data: BookCatalogItem }> {
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const res = await fetch(`${API_BASE_URL}/library/catalog`, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("Failed to add book title");
    return res.json();
  }

  /**
   * Fetches active and historical circulation loans
   */
  static async getCirculationLoans(token?: string, status?: string): Promise<{ success: boolean; data: CirculationLoanRecord[] }> {
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const params = new URLSearchParams();
    if (status && status !== "ALL") params.set("status", status);

    const res = await fetch(`${API_BASE_URL}/library/circulation?${params.toString()}`, { headers });
    if (!res.ok) throw new Error("Failed to fetch circulation loans");
    return res.json();
  }

  /**
   * Issues a book copy to a borrower (Instant Checkout)
   */
  static async checkoutBook(
    token: string | undefined,
    payload: { borrowerRollNo: string; borrowerName?: string; borrowerType?: string; isbn: string; copyBarcode?: string }
  ): Promise<{ success: boolean; data: CirculationLoanRecord }> {
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const res = await fetch(`${API_BASE_URL}/library/circulation/checkout`, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("Failed to checkout book");
    return res.json();
  }

  /**
   * Processes a book return and calculates overdue fines
   */
  static async returnBook(
    token: string | undefined,
    payload: { loanId?: string; copyBarcode?: string }
  ): Promise<{ success: boolean; data: CirculationLoanRecord }> {
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const res = await fetch(`${API_BASE_URL}/library/circulation/return`, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("Failed to return book");
    return res.json();
  }

  /**
   * Public OPAC search query
   */
  static async opacSearch(query?: string, category?: string): Promise<{ success: boolean; data: BookCatalogItem[] }> {
    const params = new URLSearchParams();
    if (query) params.set("query", query);
    if (category && category !== "ALL") params.set("category", category);

    const res = await fetch(`${API_BASE_URL}/library/opac?${params.toString()}`);
    if (!res.ok) throw new Error("Failed to search OPAC");
    return res.json();
  }
}
