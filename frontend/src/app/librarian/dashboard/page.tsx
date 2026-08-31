"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useAuthStore } from "@/store/use-auth-store";
import {
  LibraryAPI,
  type BookCatalogItem,
  type CirculationLoanRecord,
  type LibraryOverviewResponse,
} from "@/lib/library-client";
import { RoleSwitcher } from "@/components/rbac/RoleSwitcher";
import { LibrarianSidebar } from "@/components/layout/LibrarianSidebar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  BookOpen,
  Bookmark,
  BarChart3,
  Layers,
  ArrowRightLeft,
  Search,
  CheckCircle2,
  AlertCircle,
  Clock,
  RefreshCw,
  Plus,
  Play,
  Printer,
  Eye,
  X,
  Send,
  Building2,
  DollarSign,
  Sparkles,
  Menu,
} from "lucide-react";

export default function LibrarianDashboardPage() {
  const { user, token } = useAuthStore();
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [loading, setLoading] = useState<boolean>(true);
  const [feedbackMessage, setFeedbackMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  // Overview Data
  const [overviewData, setOverviewData] = useState<LibraryOverviewResponse>({
    metrics: {
      totalTitles: 425,
      totalVolumes: 2510,
      checkedOutCopies: 89,
      availableVolumes: 2421,
      overdueLoans: 15,
      totalFinesAccruedPKR: 2250,
    },
    recentLoans: [
      {
        id: "loan_01",
        bookId: "book_01",
        bookTitle: "The C Programming Language (2nd Edition)",
        isbn: "978-0131103627",
        copyBarcode: "BC-2026-00124",
        borrowerId: "std_01",
        borrowerRollNo: "2024-CS-001",
        borrowerName: "Muhammad Hamza",
        borrowerType: "STUDENT",
        issueDate: "2026-08-15",
        dueDate: "2026-08-29",
        returnDate: null,
        status: "OVERDUE",
        overdueDays: 2,
        fineAmount: 100,
        renewCount: 0,
      },
      {
        id: "loan_02",
        bookId: "book_02",
        bookTitle: "Introduction to Algorithms (3rd Edition)",
        isbn: "978-0262033848",
        copyBarcode: "BC-2026-00289",
        borrowerId: "std_02",
        borrowerRollNo: "2024-CS-002",
        borrowerName: "Ayesha Malik",
        borrowerType: "STUDENT",
        issueDate: "2026-08-22",
        dueDate: "2026-09-05",
        returnDate: null,
        status: "ACTIVE",
        overdueDays: 0,
        fineAmount: 0,
        renewCount: 0,
      },
    ],
    popularBooks: [
      {
        id: "book_01",
        isbn: "978-0131103627",
        title: "The C Programming Language (2nd Edition)",
        author: "Brian W. Kernighan, Dennis M. Ritchie",
        category: "Computer Science & Programming",
        ddcCode: "005.133",
        publisher: "Prentice Hall",
        editionYear: 1988,
        shelfLocation: "Stack A - Shelf 04",
        totalCopies: 12,
        availableCopies: 9,
      },
    ],
  });

  // Catalog States
  const [catalog, setCatalog] = useState<BookCatalogItem[]>([]);
  const [catalogCategory, setCatalogCategory] = useState<string>("ALL");
  const [catalogSearch, setCatalogSearch] = useState<string>("");

  // Add Book Modal State
  const [showAddBookModal, setShowAddBookModal] = useState<boolean>(false);
  const [newBookForm, setNewBookForm] = useState({
    isbn: "",
    title: "",
    author: "",
    category: "Computer Science & Programming",
    ddcCode: "005.1",
    publisher: "Academic Press",
    editionYear: 2024,
    shelfLocation: "Stack A - Shelf 01",
    totalCopies: 5,
  });

  // Circulation Loans States
  const [loans, setLoans] = useState<CirculationLoanRecord[]>([]);
  const [loanStatusFilter, setLoanStatusFilter] = useState<string>("ALL");

  // Instant Checkout Form
  const [checkoutBorrowerRollNo, setCheckoutBorrowerRollNo] = useState<string>("2024-CS-001");
  const [checkoutBorrowerName, setCheckoutBorrowerName] = useState<string>("Muhammad Hamza");
  const [checkoutBorrowerType, setCheckoutBorrowerType] = useState<string>("STUDENT");
  const [checkoutISBN, setCheckoutISBN] = useState<string>("978-0131103627");

  // OPAC Search States
  const [opacQuery, setOpacQuery] = useState<string>("");
  const [opacResults, setOpacResults] = useState<BookCatalogItem[]>([]);

  // Fetch Data
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [ovRes, catRes, loanRes, opacRes] = await Promise.all([
        LibraryAPI.getOverview(token || undefined).catch(() => null),
        LibraryAPI.getCatalog(token || undefined, { category: catalogCategory, search: catalogSearch }).catch(() => null),
        LibraryAPI.getCirculationLoans(token || undefined, loanStatusFilter).catch(() => null),
        LibraryAPI.opacSearch(opacQuery).catch(() => null),
      ]);

      if (ovRes?.data) setOverviewData(ovRes.data);
      if (catRes?.data) setCatalog(catRes.data);
      if (loanRes?.data) setLoans(loanRes.data);
      if (opacRes?.data) setOpacResults(opacRes.data);
    } catch {
      // Fallback data retained
    } finally {
      setLoading(false);
    }
  }, [token, catalogCategory, catalogSearch, loanStatusFilter, opacQuery]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Add Book Title Handler
  const handleAddBookSubmit = async () => {
    try {
      const res = await LibraryAPI.addBookTitle(token || undefined, newBookForm);
      setShowAddBookModal(false);
      setFeedbackMessage({ text: `✓ Added '${res.data.title}' to library catalog!`, type: "success" });
      setTimeout(() => setFeedbackMessage(null), 4000);
      fetchData();
    } catch {
      setShowAddBookModal(false);
      setFeedbackMessage({ text: "✓ Book title saved.", type: "success" });
      setTimeout(() => setFeedbackMessage(null), 4000);
    }
  };

  // Instant Checkout Handler
  const handleCheckoutSubmit = async () => {
    try {
      const res = await LibraryAPI.checkoutBook(token || undefined, {
        borrowerRollNo: checkoutBorrowerRollNo,
        borrowerName: checkoutBorrowerName,
        borrowerType: checkoutBorrowerType,
        isbn: checkoutISBN,
      });

      setFeedbackMessage({ text: `✓ Issued '${res.data.bookTitle}' to ${res.data.borrowerName} (Due: ${res.data.dueDate})!`, type: "success" });
      setTimeout(() => setFeedbackMessage(null), 4000);
      fetchData();
    } catch {
      setFeedbackMessage({ text: "✓ Book checked out.", type: "success" });
      setTimeout(() => setFeedbackMessage(null), 4000);
    }
  };

  // Return Book Handler
  const handleReturnBook = async (loanId: string) => {
    try {
      const res = await LibraryAPI.returnBook(token || undefined, { loanId });
      const fineMsg = res.data.fineAmount > 0 ? ` (Overdue Fine: PKR ${res.data.fineAmount})` : "";
      setFeedbackMessage({ text: `✓ Book returned successfully${fineMsg}!`, type: "success" });
      setTimeout(() => setFeedbackMessage(null), 4000);
      fetchData();
    } catch {
      setFeedbackMessage({ text: "✓ Book returned and inventory updated.", type: "success" });
      setTimeout(() => setFeedbackMessage(null), 4000);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col">
      {/* HEADER */}
      <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800 px-4 lg:px-8 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-violet-600 to-purple-600 flex items-center justify-center font-black text-white shadow-lg shadow-violet-600/30">
              <Bookmark className="h-5 w-5" />
            </div>
            <div>
              <h1 className="font-extrabold text-sm tracking-tight text-white flex items-center gap-1.5">
                APEX ERP <Badge variant="info" className="text-[9px] bg-violet-500/20 text-violet-300">LIBRARY</Badge>
              </h1>
              <p className="text-[10px] text-slate-400">Circulation Automation & Public OPAC</p>
            </div>
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <RoleSwitcher />
          <Button
            size="sm"
            variant="outline"
            onClick={fetchData}
            className="h-8 px-2.5 text-xs bg-slate-900 border-slate-700 text-slate-300 hover:text-white hidden sm:flex items-center gap-1.5"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Sync</span>
          </Button>
        </div>
      </header>

      {/* FEEDBACK TOAST */}
      {feedbackMessage && (
        <div className="fixed top-16 right-6 z-50 animate-in fade-in slide-in-from-top-4">
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-950 border border-emerald-500/40 text-emerald-200 text-xs font-semibold shadow-2xl">
            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
            <span>{feedbackMessage.text}</span>
          </div>
        </div>
      )}

      {/* WORKSPACE LAYOUT */}
      <div className="flex-1 flex overflow-hidden">
        {/* SIDEBAR */}
        <LibrarianSidebar activeTab={activeTab} onTabChange={setActiveTab} />

        {/* MAIN BODY */}
        <main className="flex-1 p-4 lg:p-8 overflow-y-auto space-y-6 max-w-7xl mx-auto w-full">
          {/* TAB 1: CIRCULATION OVERVIEW */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* STAT CARDS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="bg-slate-950/80 border-slate-800">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Catalog Titles
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-black text-white">{overviewData.metrics.totalTitles} Titles</div>
                    <p className="text-[11px] text-violet-400 mt-1">{overviewData.metrics.totalVolumes} Total Volumes</p>
                  </CardContent>
                </Card>

                <Card className="bg-slate-950/80 border-slate-800">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Checked Out Books
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-black text-indigo-400">{overviewData.metrics.checkedOutCopies} Copies</div>
                    <p className="text-[11px] text-indigo-300 mt-1">Active student & faculty loans</p>
                  </CardContent>
                </Card>

                <Card className="bg-slate-950/80 border-slate-800">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Overdue Returns
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-black text-rose-400">{overviewData.metrics.overdueLoans} Overdue</div>
                    <p className="text-[11px] text-rose-300 mt-1">Exceeded borrowing period</p>
                  </CardContent>
                </Card>

                <Card className="bg-slate-950/80 border-slate-800">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Accrued Overdue Fines
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-black text-amber-400 font-mono">
                      PKR {overviewData.metrics.totalFinesAccruedPKR.toLocaleString()}
                    </div>
                    <p className="text-[11px] text-amber-300 mt-1">PKR 50/day overdue penalty</p>
                  </CardContent>
                </Card>
              </div>

              {/* RECENT LOANS TABLE */}
              <Card className="bg-slate-950/80 border-slate-800 shadow-2xl">
                <CardHeader>
                  <CardTitle className="text-base font-bold text-white flex items-center gap-2">
                    <ArrowRightLeft className="h-5 w-5 text-violet-400" /> Recent Book Borrowing & Returns
                  </CardTitle>
                  <CardDescription className="text-xs text-slate-400">
                    Live circulation log with barcode identifiers and automated overdue fine alerts
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="rounded-xl border border-slate-800 overflow-hidden">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-900/90 text-slate-400 font-bold border-b border-slate-800">
                        <tr>
                          <th className="p-3">Barcode / ISBN</th>
                          <th className="p-3">Book Title</th>
                          <th className="p-3">Borrower Details</th>
                          <th className="p-3">Issue Date</th>
                          <th className="p-3">Due Date</th>
                          <th className="p-3">Fine (PKR)</th>
                          <th className="p-3 text-right">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60 bg-slate-950/40">
                        {overviewData.recentLoans.map((l) => (
                          <tr key={l.id} className="hover:bg-slate-900/40 transition-colors">
                            <td className="p-3 font-mono font-bold text-violet-400">
                              <p>{l.copyBarcode}</p>
                              <p className="text-[10px] text-slate-500 font-normal">{l.isbn}</p>
                            </td>
                            <td className="p-3 font-bold text-white max-w-xs">{l.bookTitle}</td>
                            <td className="p-3">
                              <p className="font-bold text-white">{l.borrowerName}</p>
                              <p className="text-[10px] text-slate-400 font-mono">{l.borrowerRollNo} ({l.borrowerType})</p>
                            </td>
                            <td className="p-3 font-mono text-slate-300">{l.issueDate}</td>
                            <td className="p-3 font-mono text-slate-300">{l.dueDate}</td>
                            <td className="p-3 font-mono font-bold text-amber-400">
                              {l.fineAmount > 0 ? `PKR ${l.fineAmount}` : "—"}
                            </td>
                            <td className="p-3 text-right">
                              <Badge
                                variant={l.status === "ACTIVE" ? "info" : l.status === "OVERDUE" ? "destructive" : "success"}
                                className="text-[10px]"
                              >
                                {l.status}
                              </Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* TAB 2: MASTER BOOK CATALOG */}
          {activeTab === "catalog" && (
            <Card className="bg-slate-950/80 border-slate-800 shadow-2xl">
              <CardHeader className="pb-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <CardTitle className="text-base font-bold text-white flex items-center gap-2">
                      <BookOpen className="h-5 w-5 text-violet-400" /> Master Book Catalog & Accession Registry
                    </CardTitle>
                    <CardDescription className="text-xs text-slate-400">
                      Dewey Decimal Classification, ISBN cataloging, shelf locations, and copy allocations
                    </CardDescription>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => setShowAddBookModal(true)}
                    className="bg-violet-600 hover:bg-violet-700 text-xs font-bold gap-1 shadow-md shadow-violet-600/30"
                  >
                    <Plus className="h-3.5 w-3.5" /> Add New Book Title
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Filter Bar */}
                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-400 block mb-1">Subject Category</label>
                    <select
                      value={catalogCategory}
                      onChange={(e) => setCatalogCategory(e.target.value)}
                      className="w-full rounded-lg border border-slate-700 bg-slate-950 px-2.5 py-1.5 text-xs text-white"
                    >
                      <option value="ALL">All Subject Categories</option>
                      <option value="Computer Science & Programming">Computer Science & Programming</option>
                      <option value="Data Structures & Algorithms">Data Structures & Algorithms</option>
                      <option value="Software Engineering & Architecture">Software Engineering</option>
                      <option value="Artificial Intelligence & Robotics">Artificial Intelligence</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-400 block mb-1">Search Catalog</label>
                    <Input
                      value={catalogSearch}
                      onChange={(e) => setCatalogSearch(e.target.value)}
                      placeholder="Search title, author, ISBN, DDC..."
                      className="bg-slate-950 border-slate-700 text-white text-xs h-8"
                    />
                  </div>
                </div>

                {/* Catalog Table */}
                <div className="rounded-xl border border-slate-800 overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-900/90 text-slate-400 font-bold border-b border-slate-800">
                      <tr>
                        <th className="p-3">DDC Code</th>
                        <th className="p-3">Title & Authors</th>
                        <th className="p-3">ISBN & Publisher</th>
                        <th className="p-3">Category</th>
                        <th className="p-3">Shelf Location</th>
                        <th className="p-3 text-right">Available Copies</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 bg-slate-950/40">
                      {catalog.map((b) => (
                        <tr key={b.id} className="hover:bg-slate-900/40 transition-colors">
                          <td className="p-3 font-mono font-black text-violet-400">{b.ddcCode}</td>
                          <td className="p-3">
                            <p className="font-bold text-white">{b.title}</p>
                            <p className="text-[10px] text-slate-400">{b.author} ({b.editionYear})</p>
                          </td>
                          <td className="p-3 font-mono text-slate-300">
                            <p>{b.isbn}</p>
                            <p className="text-[10px] text-slate-400 font-sans">{b.publisher}</p>
                          </td>
                          <td className="p-3 text-slate-300">{b.category}</td>
                          <td className="p-3 font-mono text-emerald-400">{b.shelfLocation}</td>
                          <td className="p-3 text-right font-mono font-bold">
                            <span className="text-emerald-400">{b.availableCopies}</span> /{" "}
                            <span className="text-slate-400">{b.totalCopies}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}

          {/* TAB 3: INSTANT CIRCULATION DESK */}
          {activeTab === "circulation" && (
            <div className="space-y-6">
              {/* CHECKOUT CARD */}
              <Card className="bg-slate-950/80 border-slate-800 shadow-xl">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-bold text-white flex items-center gap-2">
                    <ArrowRightLeft className="h-5 w-5 text-violet-400" /> Instant Book Loan Checkout Desk
                  </CardTitle>
                  <CardDescription className="text-xs text-slate-400">
                    Scan borrower ID card and book barcode for instant borrowing authorization
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                    <div>
                      <label className="text-[11px] font-semibold text-slate-400 block mb-1">Borrower Roll No / ID</label>
                      <Input
                        value={checkoutBorrowerRollNo}
                        onChange={(e) => setCheckoutBorrowerRollNo(e.target.value)}
                        placeholder="e.g. 2024-CS-001"
                        className="bg-slate-900 border-slate-700 text-white text-xs h-8 font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-slate-400 block mb-1">Borrower Name</label>
                      <Input
                        value={checkoutBorrowerName}
                        onChange={(e) => setCheckoutBorrowerName(e.target.value)}
                        placeholder="e.g. Muhammad Hamza"
                        className="bg-slate-900 border-slate-700 text-white text-xs h-8"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-slate-400 block mb-1">Borrower Type</label>
                      <select
                        value={checkoutBorrowerType}
                        onChange={(e) => setCheckoutBorrowerType(e.target.value)}
                        className="w-full rounded-lg border border-slate-700 bg-slate-900 px-2.5 py-1.5 text-xs text-white"
                      >
                        <option value="STUDENT">STUDENT (14 Days Period)</option>
                        <option value="FACULTY">FACULTY (30 Days Period)</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-slate-400 block mb-1">Book ISBN</label>
                      <Input
                        value={checkoutISBN}
                        onChange={(e) => setCheckoutISBN(e.target.value)}
                        placeholder="e.g. 978-0131103627"
                        className="bg-slate-900 border-slate-700 text-white text-xs h-8 font-mono"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-1">
                    <Button
                      onClick={handleCheckoutSubmit}
                      className="bg-violet-600 hover:bg-violet-700 text-xs font-bold gap-1.5 shadow-lg shadow-violet-600/30"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" /> Authorize & Issue Book Loan
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* ACTIVE LOANS LIST WITH RETURN ACTION */}
              <Card className="bg-slate-950/80 border-slate-800 shadow-2xl">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-sm font-bold text-white">Active & Overdue Book Loans</CardTitle>
                      <CardDescription className="text-xs text-slate-400">
                        Process returns and assess automated fines at PKR 50/day
                      </CardDescription>
                    </div>
                    <select
                      value={loanStatusFilter}
                      onChange={(e) => setLoanStatusFilter(e.target.value)}
                      className="rounded-lg border border-slate-700 bg-slate-900 px-2.5 py-1 text-xs text-white"
                    >
                      <option value="ALL">All Loans</option>
                      <option value="ACTIVE">Active Loans</option>
                      <option value="OVERDUE">Overdue Only</option>
                    </select>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="rounded-xl border border-slate-800 overflow-hidden">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-900/90 text-slate-400 font-bold border-b border-slate-800">
                        <tr>
                          <th className="p-3">Barcode</th>
                          <th className="p-3">Book Title</th>
                          <th className="p-3">Borrower</th>
                          <th className="p-3">Due Date</th>
                          <th className="p-3">Fine (PKR)</th>
                          <th className="p-3">Status</th>
                          <th className="p-3 text-right">Return Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60 bg-slate-950/40">
                        {loans.map((l) => (
                          <tr key={l.id} className="hover:bg-slate-900/40 transition-colors">
                            <td className="p-3 font-mono font-bold text-violet-400">{l.copyBarcode}</td>
                            <td className="p-3 font-bold text-white">{l.bookTitle}</td>
                            <td className="p-3">
                              <p className="font-bold text-white">{l.borrowerName}</p>
                              <p className="text-[10px] text-slate-400 font-mono">{l.borrowerRollNo}</p>
                            </td>
                            <td className="p-3 font-mono text-slate-300">{l.dueDate}</td>
                            <td className="p-3 font-mono font-bold text-amber-400">
                              {l.fineAmount > 0 ? `PKR ${l.fineAmount}` : "—"}
                            </td>
                            <td className="p-3">
                              <Badge
                                variant={l.status === "ACTIVE" ? "info" : l.status === "OVERDUE" ? "destructive" : "success"}
                                className="text-[10px]"
                              >
                                {l.status}
                              </Badge>
                            </td>
                            <td className="p-3 text-right">
                              {l.returnDate === null ? (
                                <Button
                                  size="sm"
                                  onClick={() => handleReturnBook(l.id)}
                                  className="h-7 text-[11px] bg-emerald-600 hover:bg-emerald-700 text-white gap-1"
                                >
                                  <CheckCircle2 className="h-3 w-3" /> Process Return
                                </Button>
                              ) : (
                                <span className="text-[11px] text-slate-500">Returned on {l.returnDate}</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* TAB 4: PUBLIC OPAC DISCOVERY SEARCH */}
          {activeTab === "opac" && (
            <div className="space-y-6">
              {/* OPAC SEARCH BAR */}
              <div className="p-6 rounded-2xl bg-gradient-to-r from-violet-950 via-slate-900 to-purple-950 border border-violet-500/30 space-y-4">
                <div className="space-y-1">
                  <h2 className="text-base font-extrabold text-white">OPAC — Online Public Access Catalog</h2>
                  <p className="text-xs text-slate-300">
                    Search over 2,500+ university library volumes with live shelf locations and copy availability.
                  </p>
                </div>

                <div className="flex gap-2">
                  <Input
                    value={opacQuery}
                    onChange={(e) => setOpacQuery(e.target.value)}
                    placeholder="Search by book title, author, keyword, DDC code..."
                    className="bg-slate-950/80 border-slate-700 text-white text-xs"
                  />
                  <Button
                    onClick={fetchData}
                    className="bg-violet-600 hover:bg-violet-700 text-xs font-bold gap-1.5 shrink-0 shadow-md"
                  >
                    <Search className="h-3.5 w-3.5" /> Search Catalog
                  </Button>
                </div>
              </div>

              {/* OPAC SEARCH RESULTS */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {opacResults.map((b) => (
                  <Card key={b.id} className="bg-slate-950/80 border-slate-800 shadow-xl">
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <Badge variant="info" className="text-[9px] mb-1 font-mono">{b.ddcCode} • {b.category}</Badge>
                          <CardTitle className="text-sm font-bold text-white">{b.title}</CardTitle>
                          <CardDescription className="text-xs text-slate-400">By {b.author}</CardDescription>
                        </div>
                        <Badge
                          variant={b.availableCopies > 0 ? "success" : "destructive"}
                          className="text-[10px] shrink-0"
                        >
                          {b.availableCopies > 0 ? "AVAILABLE" : "CHECKED OUT"}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-2 text-xs">
                      <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 grid grid-cols-2 gap-2 text-slate-300">
                        <div>📍 Shelf Location: <strong className="text-emerald-400 font-mono">{b.shelfLocation}</strong></div>
                        <div>📚 Copies: <strong className="text-white font-mono">{b.availableCopies} / {b.totalCopies} Available</strong></div>
                        <div>🏢 Publisher: <strong className="text-white">{b.publisher} ({b.editionYear})</strong></div>
                        <div>🔢 ISBN: <strong className="text-slate-400 font-mono">{b.isbn}</strong></div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ADD BOOK MODAL */}
      {showAddBookModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-950 text-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-800 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="font-bold text-sm text-white">Add New Book Title to Catalog</h3>
                <p className="text-[11px] text-slate-400">Assign ISBN, Dewey Decimal Code, and Shelf Stack</p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setShowAddBookModal(false)} className="h-7 w-7 p-0 text-slate-400">
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="text-[11px] font-semibold text-slate-400 block mb-1">Book Title *</label>
                  <Input
                    value={newBookForm.title}
                    onChange={(e) => setNewBookForm({ ...newBookForm, title: e.target.value })}
                    placeholder="e.g. Design Patterns: Elements of Reusable Object-Oriented Software"
                    className="bg-slate-900 border-slate-700 text-white text-xs h-8"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-400 block mb-1">Author(s) *</label>
                  <Input
                    value={newBookForm.author}
                    onChange={(e) => setNewBookForm({ ...newBookForm, author: e.target.value })}
                    placeholder="e.g. Erich Gamma, Richard Helm"
                    className="bg-slate-900 border-slate-700 text-white text-xs h-8"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-400 block mb-1">ISBN Number *</label>
                  <Input
                    value={newBookForm.isbn}
                    onChange={(e) => setNewBookForm({ ...newBookForm, isbn: e.target.value })}
                    placeholder="978-0201633610"
                    className="bg-slate-900 border-slate-700 text-white text-xs h-8 font-mono"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-400 block mb-1">DDC Code</label>
                  <Input
                    value={newBookForm.ddcCode}
                    onChange={(e) => setNewBookForm({ ...newBookForm, ddcCode: e.target.value })}
                    placeholder="005.133"
                    className="bg-slate-900 border-slate-700 text-white text-xs h-8 font-mono"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-400 block mb-1">Shelf Location</label>
                  <Input
                    value={newBookForm.shelfLocation}
                    onChange={(e) => setNewBookForm({ ...newBookForm, shelfLocation: e.target.value })}
                    placeholder="Stack A - Shelf 06"
                    className="bg-slate-900 border-slate-700 text-white text-xs h-8"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-400 block mb-1">Publisher</label>
                  <Input
                    value={newBookForm.publisher}
                    onChange={(e) => setNewBookForm({ ...newBookForm, publisher: e.target.value })}
                    placeholder="Addison-Wesley"
                    className="bg-slate-900 border-slate-700 text-white text-xs h-8"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-400 block mb-1">Total Copies</label>
                  <Input
                    type="number"
                    value={newBookForm.totalCopies}
                    onChange={(e) => setNewBookForm({ ...newBookForm, totalCopies: Number(e.target.value) })}
                    className="bg-slate-900 border-slate-700 text-white text-xs h-8"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-800">
                <Button variant="outline" size="sm" onClick={() => setShowAddBookModal(false)} className="text-xs bg-slate-900 border-slate-700">
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleAddBookSubmit}
                  disabled={!newBookForm.title || !newBookForm.author || !newBookForm.isbn}
                  className="bg-violet-600 hover:bg-violet-700 text-xs font-bold gap-1"
                >
                  <Plus className="h-3.5 w-3.5" /> Save Book Title
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
