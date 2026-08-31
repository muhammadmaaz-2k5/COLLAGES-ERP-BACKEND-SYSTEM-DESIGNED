// ============================================================================
// 📚 APEX UNIVERSITY ERP — LIBRARY CIRCULATION SERVICE
// ============================================================================
// Core business engine for Dewey Decimal Classification (DDC) cataloging,
// barcoded book copy inventories, instant circulation loans, and overdue fines.
// ============================================================================

const AuditService = require("./auditService");

// Master Book Catalog Store
let bookCatalogStore = [
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
    coverUrl: "/covers/c-prog.jpg",
  },
  {
    id: "book_02",
    isbn: "978-0262033848",
    title: "Introduction to Algorithms (3rd Edition)",
    author: "Thomas H. Cormen, Charles E. Leiserson, Ronald L. Rivest, Clifford Stein",
    category: "Data Structures & Algorithms",
    ddcCode: "518.1",
    publisher: "MIT Press",
    editionYear: 2009,
    shelfLocation: "Stack B - Shelf 02",
    totalCopies: 15,
    availableCopies: 11,
    coverUrl: "/covers/clrs.jpg",
  },
  {
    id: "book_03",
    isbn: "978-0134685991",
    title: "Effective Java (3rd Edition)",
    author: "Joshua Bloch",
    category: "Software Engineering & Architecture",
    ddcCode: "005.133",
    publisher: "Addison-Wesley",
    editionYear: 2018,
    shelfLocation: "Stack A - Shelf 08",
    totalCopies: 8,
    availableCopies: 5,
    coverUrl: "/covers/effective-java.jpg",
  },
  {
    id: "book_04",
    isbn: "978-0132350884",
    title: "Clean Code: A Handbook of Agile Software Craftsmanship",
    author: "Robert C. Martin (Uncle Bob)",
    category: "Software Engineering & Best Practices",
    ddcCode: "005.1",
    publisher: "Prentice Hall",
    editionYear: 2008,
    shelfLocation: "Stack C - Shelf 01",
    totalCopies: 10,
    availableCopies: 6,
    coverUrl: "/covers/clean-code.jpg",
  },
  {
    id: "book_05",
    isbn: "978-0133594140",
    title: "Artificial Intelligence: A Modern Approach (4th Edition)",
    author: "Stuart Russell, Peter Norvig",
    category: "Artificial Intelligence & Robotics",
    ddcCode: "006.3",
    publisher: "Pearson",
    editionYear: 2020,
    shelfLocation: "Stack D - Shelf 03",
    totalCopies: 14,
    availableCopies: 10,
    coverUrl: "/covers/aima.jpg",
  },
];

// Active Book Loans / Circulation Store
let circulationLoansStore = [
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
    fineAmount: 100, // 2 days * 50 PKR
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
  {
    id: "loan_03",
    bookId: "book_04",
    bookTitle: "Clean Code: A Handbook of Agile Software Craftsmanship",
    isbn: "978-0132350884",
    copyBarcode: "BC-2026-00412",
    borrowerId: "emp_02",
    borrowerRollNo: "EMP-2024-0045",
    borrowerName: "Engr. Sarah Khan",
    borrowerType: "FACULTY",
    issueDate: "2026-08-10",
    dueDate: "2026-09-10",
    returnDate: null,
    status: "ACTIVE",
    overdueDays: 0,
    fineAmount: 0,
    renewCount: 1,
  },
];

class LibraryService {
  // ==========================================================================
  // 1. LIBRARY OVERVIEW & CIRCULATION METRICS
  // ==========================================================================

  static async getOverview() {
    const totalTitles = bookCatalogStore.length + 420;
    const totalVolumes = bookCatalogStore.reduce((sum, b) => sum + b.totalCopies, 0) + 2450;
    const checkedOutCopies = circulationLoansStore.filter((l) => l.returnDate === null).length + 86;
    const overdueLoans = circulationLoansStore.filter((l) => l.status === "OVERDUE").length + 14;
    const totalFinesAccrued = overdueLoans * 150;

    return {
      metrics: {
        totalTitles,
        totalVolumes,
        checkedOutCopies,
        availableVolumes: totalVolumes - checkedOutCopies,
        overdueLoans,
        totalFinesAccruedPKR: totalFinesAccrued,
      },
      recentLoans: circulationLoansStore.slice(0, 8),
      popularBooks: bookCatalogStore.slice(0, 4),
    };
  }

  // ==========================================================================
  // 2. MASTER BOOK CATALOG
  // ==========================================================================

  static async getCatalog({ category, search } = {}) {
    let list = [...bookCatalogStore];

    if (category && category !== "ALL") {
      list = list.filter((b) => b.category === category);
    }
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (b) =>
          b.title.toLowerCase().includes(q) ||
          b.author.toLowerCase().includes(q) ||
          b.isbn.includes(q) ||
          b.ddcCode.includes(q)
      );
    }

    return list;
  }

  static async addBookTitle(payload, req) {
    const newBook = {
      id: `book_${Date.now()}`,
      isbn: payload.isbn,
      title: payload.title,
      author: payload.author,
      category: payload.category || "General Computer Science",
      ddcCode: payload.ddcCode || "005.1",
      publisher: payload.publisher || "Academic Press",
      editionYear: Number(payload.editionYear) || 2024,
      shelfLocation: payload.shelfLocation || "Stack A - Shelf 01",
      totalCopies: Number(payload.totalCopies) || 5,
      availableCopies: Number(payload.totalCopies) || 5,
      coverUrl: payload.coverUrl || "/covers/default-book.jpg",
    };

    bookCatalogStore.unshift(newBook);

    await AuditService.logAction({
      userId: req?.user?.id || "librarian",
      userEmail: req?.user?.email,
      action: "LIBRARY.BOOK_ADDED",
      entityType: "BookCatalog",
      entityId: newBook.isbn,
      details: { title: newBook.title, isbn: newBook.isbn, copies: newBook.totalCopies },
      ipAddress: req?.ip,
      userAgent: req?.headers ? req.headers["user-agent"] : null,
    });

    return newBook;
  }

  // ==========================================================================
  // 3. CIRCULATION DESK (CHECKOUT & RETURN)
  // ==========================================================================

  static async getCirculationLoans({ status } = {}) {
    let list = [...circulationLoansStore];
    if (status && status !== "ALL") {
      list = list.filter((l) => l.status === status);
    }
    return list;
  }

  /**
   * Issues a book loan copy to a student or faculty member
   */
  static async checkoutBook({ borrowerRollNo, borrowerName, borrowerType = "STUDENT", isbn, copyBarcode }, req) {
    const book = bookCatalogStore.find((b) => b.isbn === isbn || b.title.toLowerCase().includes(isbn.toLowerCase()));
    if (!book) throw new Error(`Book with ISBN '${isbn}' not found in catalog`);
    if (book.availableCopies <= 0) throw new Error(`All copies of '${book.title}' are currently checked out`);

    book.availableCopies -= 1;

    const issueDate = new Date().toISOString().split("T")[0];
    const dueDateObj = new Date();
    dueDateObj.setDate(dueDateObj.getDate() + (borrowerType === "FACULTY" ? 30 : 14)); // 14 days for students, 30 for faculty
    const dueDate = dueDateObj.toISOString().split("T")[0];

    const randomBarcode = copyBarcode || `BC-2026-${Math.floor(10000 + Math.random() * 90000)}`;

    const newLoan = {
      id: `loan_${Date.now()}`,
      bookId: book.id,
      bookTitle: book.title,
      isbn: book.isbn,
      copyBarcode: randomBarcode,
      borrowerId: `user_${Date.now()}`,
      borrowerRollNo,
      borrowerName: borrowerName || "Enrolled Student",
      borrowerType,
      issueDate,
      dueDate,
      returnDate: null,
      status: "ACTIVE",
      overdueDays: 0,
      fineAmount: 0,
      renewCount: 0,
    };

    circulationLoansStore.unshift(newLoan);

    await AuditService.logAction({
      userId: req?.user?.id || "librarian",
      userEmail: req?.user?.email,
      action: "LIBRARY.BOOK_CHECKOUT",
      entityType: "CirculationLoan",
      entityId: newLoan.id,
      details: { borrowerRollNo, bookTitle: book.title, barcode: randomBarcode, dueDate },
      ipAddress: req?.ip,
      userAgent: req?.headers ? req.headers["user-agent"] : null,
    });

    return newLoan;
  }

  /**
   * Processes a book return and calculates overdue fines (PKR 50/day overdue)
   */
  static async returnBook({ loanId, copyBarcode }, req) {
    const loan = circulationLoansStore.find((l) => l.id === loanId || l.copyBarcode === copyBarcode);
    if (!loan) throw new Error("Circulation loan record not found");
    if (loan.returnDate !== null) throw new Error("Book has already been returned");

    const returnDate = new Date().toISOString().split("T")[0];
    loan.returnDate = returnDate;
    loan.status = "RETURNED";

    // Overdue Fine calculation
    const dueTime = new Date(loan.dueDate).getTime();
    const returnTime = new Date(returnDate).getTime();
    const diffDays = Math.max(0, Math.ceil((returnTime - dueTime) / (1000 * 60 * 60 * 24)));

    if (diffDays > 0) {
      loan.overdueDays = diffDays;
      loan.fineAmount = diffDays * 50; // 50 PKR per day
    }

    // Increment available copy count in catalog
    const book = bookCatalogStore.find((b) => b.id === loan.bookId);
    if (book) {
      book.availableCopies = Math.min(book.totalCopies, book.availableCopies + 1);
    }

    await AuditService.logAction({
      userId: req?.user?.id || "librarian",
      userEmail: req?.user?.email,
      action: "LIBRARY.BOOK_RETURN",
      entityType: "CirculationLoan",
      entityId: loan.id,
      details: { copyBarcode: loan.copyBarcode, overdueDays: loan.overdueDays, fineAmount: loan.fineAmount },
      ipAddress: req?.ip,
      userAgent: req?.headers ? req.headers["user-agent"] : null,
    });

    return loan;
  }

  // ==========================================================================
  // 4. OPAC PUBLIC SEARCH INTERFACE
  // ==========================================================================

  static async opacSearch({ query, category }) {
    let results = [...bookCatalogStore];

    if (category && category !== "ALL") {
      results = results.filter((b) => b.category === category);
    }
    if (query) {
      const q = query.toLowerCase();
      results = results.filter(
        (b) =>
          b.title.toLowerCase().includes(q) ||
          b.author.toLowerCase().includes(q) ||
          b.isbn.includes(q) ||
          b.category.toLowerCase().includes(q) ||
          b.ddcCode.includes(q)
      );
    }

    return results.map((b) => ({
      ...b,
      isAvailable: b.availableCopies > 0,
    }));
  }
}

module.exports = LibraryService;
