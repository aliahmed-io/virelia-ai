import { describe, it, expect } from "vitest";
import {
  getPatientDocuments,
  addPatientDocument,
  deletePatientDocument,
} from "../src/lib/data";

describe("Patient Documents Storage Engine (Images, Word, PDF)", () => {
  it("fetches pre-seeded sample documents for the patient account", async () => {
    const docs = await getPatientDocuments("usr-patient");
    expect(docs.length).toBeGreaterThanOrEqual(3);

    const hasPdf = docs.some((d) => d.fileType === "PDF");
    const hasImage = docs.some((d) => d.fileType === "IMAGE");
    const hasWord = docs.some((d) => d.fileType === "WORD");

    expect(hasPdf).toBe(true);
    expect(hasImage).toBe(true);
    expect(hasWord).toBe(true);
  });

  it("adds and deletes a new patient medical document", async () => {
    const created = await addPatientDocument({
      userId: "usr-patient",
      title: "تحليل وظائف كبد وكلى",
      category: "lab",
      fileType: "PDF",
      fileName: "liver_kidney_function_test.pdf",
      fileSize: 312000,
      fileUrl: "data:application/pdf;base64,JVBERi0xLjQK...",
    });

    expect(created.id).toBeDefined();
    expect(created.title).toBe("تحليل وظائف كبد وكلى");
    expect(created.fileType).toBe("PDF");

    const docsAfterAdd = await getPatientDocuments("usr-patient");
    expect(docsAfterAdd.some((d) => d.id === created.id)).toBe(true);

    // Delete
    const deleted = await deletePatientDocument(created.id);
    expect(deleted).toBe(true);

    const docsAfterDelete = await getPatientDocuments("usr-patient");
    expect(docsAfterDelete.some((d) => d.id === created.id)).toBe(false);
  });
});
